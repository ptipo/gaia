import { match } from 'ts-pattern';
import { Concept, ConfigItem } from '.';
import { CodeLanguage, IfItem } from './items';

/**
 * Build JSON schema out of a concept configuration.
 */
export class JSONSchemaBuilder {
    private result: Record<string, any> = {};

    build(concept: Concept): object {
        this.result = {
            title: `${concept.displayName} Schema`,
            description: concept.description,
            $defs: {},
        };

        this.result = { ...this.result, ...this.makeDefRef(concept.name) };

        this.buildConcept(concept);
        this.buildCommonSchemas();

        return this.result;
    }

    private buildCommonSchemas() {
        this.result.$defs['DynamicSelectOption'] = {
            type: 'object',
            required: ['key', 'value', 'label'],
            properties: {
                key: { enum: ['string', 'number'] },
                label: { type: 'string' },
                value: {},
            },
        };

        this.result.$defs['Color'] = {
            type: 'string',
            pattern: '^rgba(d{1,3},s*d{1,3},s*d{1,3},s*d(.d+)?)$',
        };

        this.result.$defs['Image'] = {
            type: 'object',
            required: ['$type', 'url'],
            properties: {
                $type: { const: 'image' },
                url: { type: 'string', format: 'uri' },
            },
        };

        this.result.$defs['Code'] = {
            type: 'object',
            required: ['$type', 'language', 'source'],
            properties: {
                $type: { const: 'code' },
                language: { enum: [CodeLanguage.CSS] },
                source: { type: 'string', default: '' },
            },
        };

        this.result.$defs['LogicalGroup'] = {
            anyOf: [
                {
                    type: 'object',
                    required: ['kind', 'left', 'operator'],
                    properties: {
                        kind: { const: 'expression' },
                        operator: { type: 'string' },
                        left: {},
                        right: {},
                    },
                },
                {
                    $ref: '#/$defs/LogicalGroupAssociation',
                },
            ],
        };

        this.result.$defs['LogicalGroupAssociation'] = {
            type: 'object',
            required: ['kind', 'groupOperator', 'first', 'second'],
            properties: {
                kind: { const: 'association' },
                groupOperator: { enum: ['and', 'or'] },
                first: { $ref: '#/$defs/LogicalGroup' },
                second: { $ref: '#/$defs/LogicalGroup' },
            },
        };
    }

    private makeDefRef(name: String) {
        return { $ref: `#/$defs/${name}` };
    }

    private buildConcept(concept: Concept) {
        const items = Object.entries(concept.items).filter(([key]) => !concept.excludeFromSchema?.includes(key));

        if (!this.result.$defs[concept.name]) {
            let conceptSchema: Record<string, any> = {
                type: 'object',
                required: [
                    '$type',
                    '$id',
                    '$concept',
                    ...items.filter(([_, item]) => this.isRequired(item)).map(([key, _]) => key),
                ],
                properties: {
                    $type: { const: 'concept' },
                    $id: { type: 'string', format: 'uuid' },
                    $concept: { const: concept.name },
                    ...items
                        .filter(([_, item]) => !this.isIfWithSimpleCondition(item))
                        .reduce<any>((acc, [key, item]) => {
                            acc[key] = this.buildItem(item);
                            return acc;
                        }, {}),
                },
            };

            // deal with "if" item with a simple condition
            const ifThen = this.buildIfThen(items);
            conceptSchema = { ...conceptSchema, ...ifThen };

            this.result.$defs[concept.name] = conceptSchema;
        }

        return this.makeDefRef(concept.name);
    }

    private isIfWithSimpleCondition(item: ConfigItem) {
        return item.type === 'if' && item.condition;
    }

    private buildIfThen(items: [string, ConfigItem][]) {
        const ifWithSimpleConditions = items.filter(([_, item]) => item.type === 'if' && item.condition);

        let iteFields: any = {};

        if (ifWithSimpleConditions.length > 0) {
            if (ifWithSimpleConditions.length > 1) {
                iteFields = { allOf: [] };
                for (const [key, item] of ifWithSimpleConditions) {
                    const ite = this.buildIfItem(key, item as IfItem);
                    iteFields.allOf.push(ite);
                }
            } else {
                iteFields = this.buildIfItem(ifWithSimpleConditions[0][0], ifWithSimpleConditions[0][1] as IfItem);
            }
        }

        return iteFields;
    }

    private buildIfItem(key: string, item: IfItem) {
        if (item.condition) {
            return {
                if: { properties: { [item.condition.field]: { const: item.condition.value } } },
                then: {
                    properties: { [key]: this.buildItem({ description: item.description, ...item.child }) },
                    ...(item.child.required ? { required: [key] } : {}),
                },
            };
        } else {
            throw new Error("Shouldn't get here!");
        }
    }

    private buildItem(item: ConfigItem): any {
        const result = match(item)
            .with({ type: 'number' }, (item) => ({
                type: 'number',
                default: item.default,
            }))
            .with({ type: 'text' }, (item) => ({
                type: 'string',
                default: item.default,
            }))
            .with({ type: 'switch' }, (item) => ({
                type: 'boolean',
                default: item.default,
            }))
            .with({ type: 'select' }, (item) => ({
                enum: Object.keys(item.options),
                default: item.default,
            }))
            .with({ type: 'dynamic-select' }, (item) =>
                item.multiple
                    ? {
                          type: 'array',
                          items: this.makeDefRef('DynamicSelectOption'),
                      }
                    : this.makeDefRef('DynamicSelectOption')
            )
            .with({ type: 'color' }, (item) => ({ ...this.makeDefRef('Color'), default: item.default }))
            .with({ type: 'image' }, () => this.makeDefRef('Image'))
            .with({ type: 'code' }, () => this.makeDefRef('Code'))
            // TODO: conditional schema?
            .with({ type: 'if' }, (item) => {
                if (item.condition) {
                    throw new Error("Shouldn't get here!");
                } else {
                    return this.buildItem({ description: item.description, ...item.child });
                }
            })
            .with({ type: 'has' }, (item) => this.buildConcept(item.concept))
            .with({ type: 'has-many' }, (item) => ({
                type: 'array',
                description: item.description,
                items: {
                    anyOf: item.candidates.map((candidate) => this.buildConcept(candidate)),
                },
                minItems: item.minItems,
                maxItems: item.maxItems,
            }))
            .with({ type: 'group' }, (item) => {
                let groupSchema = {
                    type: 'object',
                    required: [
                        '$type',
                        ...Object.entries(item.items)
                            .filter(([_, subItem]) => this.isRequired(subItem))
                            .map(([key, _]) => key),
                    ],
                    properties: {
                        $type: { const: 'item-group' },
                        ...Object.entries(item.items)
                            .filter(([_, item]) => !this.isIfWithSimpleCondition(item))
                            .reduce<any>((acc, [key, item]) => {
                                acc[key] = this.buildItem(item);
                                return acc;
                            }, {}),
                    },
                };

                const ifThen = this.buildIfThen(Object.entries(item.items));
                groupSchema = { ...groupSchema, ...ifThen };

                return groupSchema;
            })
            .with({ type: 'logical-group' }, () => this.makeDefRef('LogicalGroup'))
            .exhaustive();

        return { title: item.name, description: item.description, ...result };
    }

    private isRequired(item: ConfigItem): unknown {
        return (
            item.required ||
            // concept/group fields are always required
            item.type === 'has' ||
            item.type === 'has-many' ||
            item.type === 'group'
        );
    }
}
