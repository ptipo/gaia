import { ProviderContext } from '@/types';
import { ZodDiscriminatedUnionOption, z } from 'zod';
import { Concept, makeConceptSchema } from '../concept';
import { BaseConceptModel } from '../inference';
import { ConfigItemBase } from './common';

/**
 * An item that manages multiple instances of `Concept` from
 * a given list of candidates.
 */
export interface HasManyItem<TCandidate extends Concept = Concept> extends ConfigItemBase {
    type: 'has-many';

    /**
     * `Concept` candidates
     */
    candidates: TCandidate[];

    /**
     * If the items should be rendered inline
     */
    inline?: boolean;

    /**
     * Callback for creating a new concept instance
     */
    newItemProvider?: (concept: Concept, context: ProviderContext) => BaseConceptModel;

    /**
     * Callback for handling model changes of a child item
     */
    onChildChange?: (changedItem: BaseConceptModel, currentModel: BaseConceptModel[]) => void;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as HasManyItem;
    if (myItem.candidates.length === 0) {
        return z.never();
    }

    const candidates = myItem.candidates.map((concept) => makeConceptSchema(concept));
    let result = z.array(
        candidates.length > 1
            ? z.discriminatedUnion(
                  '$concept',
                  candidates as unknown as [
                      ZodDiscriminatedUnionOption<'$concept'>,
                      ...ZodDiscriminatedUnionOption<'$concept'>[]
                  ]
              )
            : candidates[0]
    );

    if (item.required) {
        return result.nonempty();
    } else {
        return result;
    }
};
