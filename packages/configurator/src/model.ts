import { P, match } from 'ts-pattern';
import { ConfigItem, inferPartialConcept } from '.';
import { Concept } from './concept';
import { GroupItem } from './items';
import { NonPrimitiveTypes } from './types';

/**
 * 为`Concept`创建初始模型
 */
export function createModelForConcept<TConcept extends Concept>(
    concept: TConcept
): inferPartialConcept<TConcept> {
    const result: any = {
        $type: NonPrimitiveTypes.concept,
        $concept: concept.name,
    };

    for (const [key, value] of Object.entries(concept.items)) {
        const itemValue = createModelForItem(value);
        if (itemValue !== undefined) {
            result[key] = itemValue;
        }
    }

    return result;
}

function createModelForItem(item: ConfigItem): any {
    return match(item)
        .with(
            { type: P.union('text', 'number', 'switch', 'select') },
            (item) => item.default
        )
        .with({ type: 'has' }, (item) => createModelForConcept(item.concept))
        .with({ type: 'has-many' }, () => [
            /* TODO: 初始项 */
        ])
        .with({ type: 'group' }, (item) => createModelForGroup(item))
        .otherwise(() => undefined);
}

function createModelForGroup(item: GroupItem): any {
    const result: any = {};
    for (const [key, value] of Object.entries(item.items)) {
        const itemValue = createModelForItem(value);
        if (itemValue !== undefined) {
            result[key] = itemValue;
        }
    }
    return result;
}
