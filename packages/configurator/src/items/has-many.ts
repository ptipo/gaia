import type { ProviderContext } from '@/types';
import { z } from 'zod';
import type { GetSchemaContext } from '.';
import { makeConceptSchema, type Concept } from '../concept';
import type { BaseConceptModel } from '../inference';
import type { ConfigItemBase } from './common';

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
     * Callback for cloning an existing concept instance
     */
    cloneItemProvider?: (concept: Concept, source: BaseConceptModel, context: ProviderContext) => BaseConceptModel;

    /**
     * Callback for handling model changes of a child item
     */
    onChildChange?: (changedItem: BaseConceptModel, currentModel: BaseConceptModel[]) => void;
}

export const getSchema = (item: ConfigItemBase, context: GetSchemaContext) => {
    const myItem = item as HasManyItem;
    if (myItem.candidates.length === 0) {
        return z.never();
    }

    if (context.currentModel === undefined) {
        if (item.required) {
            return z.never({ message: '至少需要一项' });
        } else {
            return z.undefined();
        }
    }

    if (!Array.isArray(context.currentModel)) {
        throw new Error('Expected current model to be an array');
    }

    if (item.required && context.currentModel.length === 0) {
        return z.never({ message: '至少需要一项' });
    }

    // build a tuple schema that validates each item according to its concept and model
    const itemSchemas = context.currentModel.map((el, index) => {
        const candidate = myItem.candidates.find((c) => c.name === el.$concept);
        if (!candidate) {
            throw new Error(`Concept "${el.$concept}" is not a candidate of this has-many item`);
        }

        // Note that we keep the parent model to the parent of this has-many item,
        // we may need to revisit and see if we should set it to the array instead
        return makeConceptSchema(candidate, {
            ...context,
            currentModel: context.currentModel[index],
        });
    });

    return z.tuple(itemSchemas as any);
};
