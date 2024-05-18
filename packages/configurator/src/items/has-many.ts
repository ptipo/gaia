import { z } from 'zod';
import { Concept, ConceptSchema } from '../concept';
import { inferConceptModel } from '../inference';
import { ConfigItemBase } from './common';
import { getConceptSchema } from '../schema';

/**
 * 包含另外多个`Concept` (one-to-many)
 */
export interface HasManyItem<TCandidate extends Concept = Concept>
    extends ConfigItemBase {
    type: 'has-many';

    /**
     * 可关联的`Concept`
     */
    candidates: TCandidate[];

    /**
     * 是否内联展示
     */
    inline?: boolean;

    /**
     * 初始项目
     */
    initialItemsProvider?: () => inferConceptModel<TCandidate>[];

    /**
     * 新增项提供函数
     */
    newItemProvider?: (
        concept: TCandidate,
        currentModel: inferConceptModel<TCandidate>[]
    ) => object;

    /**
     * 响应子项配置变化
     */
    onChildChange?: (
        changedItem: inferConceptModel<TCandidate>,
        currentModel: inferConceptModel<TCandidate>[]
    ) => void;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as HasManyItem;
    if (myItem.candidates.length === 0) {
        return z.never();
    }

    const candidates = myItem.candidates.map((concept) =>
        getConceptSchema(concept)
    );
    return z.array(
        candidates.length > 1
            ? z.union(
                  candidates as unknown as readonly [
                      ReturnType<typeof getConceptSchema>,
                      ReturnType<typeof getConceptSchema>,
                      ...ReturnType<typeof getConceptSchema>[]
                  ]
              )
            : candidates[0]
    );
};
