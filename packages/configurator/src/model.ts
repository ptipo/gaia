import { P, match } from 'ts-pattern';
import { ConfigItem, inferConceptModel } from '.';
import { Concept } from './concept';
import { NonPrimitiveTypes } from './types';
import { DeepPartialConceptModel } from './utils';

export function createModelForConcept<
    TConcept extends Concept = Concept,
    TModel = inferConceptModel<TConcept>
>(concept: Concept): DeepPartialConceptModel<TModel> {
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
        .with({ type: 'has-many' }, () => [])
        .otherwise(() => undefined);
}
