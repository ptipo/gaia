import { z } from 'zod';
import { Concept, getConceptSchema } from '../concept';
import { BaseConceptModel } from '../inference';
import { ConfigItemBase } from './common';

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
    initialItemsProvider?: () => object[];

    /**
     * 新增项提供函数
     */
    newItemProvider?: (
        concept: Concept,
        currentModel: BaseConceptModel[]
    ) => BaseConceptModel;

    /**
     * 响应子项配置变化
     */
    onChildChange?: (
        changedItem: BaseConceptModel,
        currentModel: BaseConceptModel[]
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
