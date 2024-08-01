import { match } from 'ts-pattern';
import { Concept, ConfigItem } from '.';
import { CodeLanguage } from './items';

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
        if (!this.result.$defs[concept.name]) {
            const conceptSchema: Record<string, any> = {
                type: 'object',
                required: [
                    '$type',
                    '$id',
                    '$concept',
                    ...Object.entries(concept.items)
                        .filter(
                            ([_, item]) =>
                                item.required ||
                                // context/group fields are always required
                                item.type === 'has' ||
                                item.type === 'has-many' ||
                                item.type === 'group'
                        )
                        .map(([key, _]) => key),
                ],
                properties: {
                    $type: { const: 'concept' },
                    $id: { type: 'string', format: 'uuid' },
                    $concept: { const: concept.name },
                    ...Object.entries(concept.items).reduce<any>((acc, [key, item]) => {
                        acc[key] = this.buildItem(item);
                        return acc;
                    }, {}),
                },
            };
            this.result.$defs[concept.name] = conceptSchema;
        }

        return this.makeDefRef(concept.name);
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
            .with({ type: 'if' }, (item) => this.buildItem({ description: item.description, ...item.child }))
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
            .with({ type: 'group' }, (item) => ({
                type: 'object',
                required: Object.entries(item.items)
                    .filter(([_, item]) => item.required)
                    .map(([key, _]) => key),
                properties: {
                    $type: { const: 'item-group' },
                    ...Object.entries(item.items).reduce<any>((acc, [key, item]) => {
                        acc[key] = this.buildItem(item);
                        return acc;
                    }, {}),
                },
            }))
            .with({ type: 'logical-group' }, (item) => this.makeDefRef('LogicalGroup'))
            .exhaustive();

        if (item.name === 'textChoices') {
            console.log(item);
        }

        return { title: item.name, description: item.description, ...result };
    }
}
