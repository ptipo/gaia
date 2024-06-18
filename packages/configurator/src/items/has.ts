import { GetSchemaContext } from '.';
import { makeConceptSchema, type Concept } from '../concept';
import { wrap } from '../schema';
import type { ConfigItemBase } from './common';

/**
 * 包含另外一个`Concept` (one-to-one)
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
