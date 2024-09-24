import { GetSchemaContext } from '.';
import { makeConceptSchema, type Concept } from '../concept';
import { wrap } from '../schema';
import type { ConfigItemBase } from './common';

/**
 * Configuration item that has a single `Concept` as a child (1-to-1 relation).
 */
export interface HasItem<TChild extends Concept = Concept> extends ConfigItemBase {
    type: 'has';

    /**
     * 关联的`Concept`
     */
    concept: TChild;
}

export const getSchema = (item: ConfigItemBase, context: GetSchemaContext) =>
    wrap(item, makeConceptSchema((item as HasItem).concept, context));
