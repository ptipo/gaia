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
     * Minimum number of items required
     */
    minItems?: number;

    /**
     * Maximum number of items allowed
     */
    maxItems?: number;

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

    const minItems = myItem.minItems ?? item.required ? 1 : 0;
    const maxItems = myItem.maxItems ?? Infinity;

    if (context.currentModel === undefined) {
        if (minItems > 0) {
            return z.never({ message: `至少需要${minItems}项` });
        } else {
            return z.undefined();
        }
    }

    if (!Array.isArray(context.currentModel)) {
        throw new Error('Expected current model to be an array');
    }

    if (context.currentModel.length < minItems) {
        return z.never({ message: `至少需要${minItems}项` });
    }

    if (context.currentModel.length > maxItems) {
        return z.never({ message: `最多只能有${maxItems}项` });
    }

    const indicesToRemove: number[] = [];

    // build a tuple schema that validates each item according to its concept and model
    const itemSchemas = context.currentModel.map((el, index) => {
        const candidate = myItem.candidates.find((c) => c.name === el.$concept);
        if (!candidate) {
            if (context.autoFix) {
                indicesToRemove.push(index);
                return z.any();
            } else {
                return z.never({ message: `Concept "${el.$concept}" is not a candidate of this has-many item` });
            }
        }

        // Note that we keep the parent model to the parent of this has-many item,
        // we may need to revisit and see if we should set it to the array instead
        return makeConceptSchema(candidate, {
            ...context,
            currentModel: context.currentModel?.[index],
        });
    });

    const result = z.tuple(itemSchemas as any);

    if (indicesToRemove.length > 0) {
        console.warn(`Removing items that don't match the candidates:`);
        indicesToRemove.forEach((index) => console.warn(`\t${JSON.stringify(context.currentModel?.[index])})`));
        return result.transform((data) => data.filter((_, index) => !indicesToRemove.includes(index)));
    } else {
        return result;
    }
};
