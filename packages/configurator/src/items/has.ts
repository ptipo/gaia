import { Concept } from '../concept';
import { getConceptSchema } from '../schema';
import { ConfigItemBase } from './common';

/**
 * 包含另外一个`Concept` (one-to-one)
 */
export interface HasItem<TChild extends Concept = Concept>
    extends ConfigItemBase {
    type: 'has';

    /**
     * 关联的`Concept`
     */
    concept: TChild;
}

export const getSchema = (item: ConfigItemBase) =>
    getConceptSchema((item as HasItem).concept);
