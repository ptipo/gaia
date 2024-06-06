import { Concept, makeConceptSchema } from '../concept';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

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

export const getSchema = (item: ConfigItemBase) => wrap(item, makeConceptSchema((item as HasItem).concept));
