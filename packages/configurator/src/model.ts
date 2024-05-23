import { P, match } from 'ts-pattern';
import { ConfigItem, DeepPartialConcept, inferPartialConcept } from '.';
import { Concept } from './concept';
import { GroupItem } from './items';
import { NonPrimitiveTypes } from './types';

/**
 * 为`Concept`创建初始模型
 */
export function createConceptModel<TConcept extends Concept>(
    concept: TConcept,
    data?: Omit<DeepPartialConcept<TConcept>, '$type' | '$concept'> &
        Record<string, unknown>
): inferPartialConcept<TConcept> {
    const result: any = {
        $type: NonPrimitiveTypes.concept,
        $concept: concept.name,
    };

    for (const [key, value] of Object.entries(concept.items)) {
        if (data?.[key] !== undefined) {
            result[key] = data[key];
        } else {
            result[key] = createItemModel(value);
        }
    }

    return result;
}

function createItemModel(item: ConfigItem): any {
    return match(item)
        .with(
            { type: P.union('text', 'number', 'switch', 'select') },
            (item) => item.default
        )
        .with({ type: 'has' }, (item) => createConceptModel(item.concept))
        .with({ type: 'has-many' }, () => [
            /* TODO: 初始项 */
        ])
        .with({ type: 'group' }, (item) => createGroupModel(item))
        .otherwise(() => undefined);
}

function createGroupModel(item: GroupItem): any {
    const result: any = {};
    for (const [key, value] of Object.entries(item.items)) {
        const itemValue = createItemModel(value);
        if (itemValue !== undefined) {
            result[key] = itemValue;
        }
    }
    return result;
}
