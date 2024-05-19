import { z } from 'zod';
import { ConfigItem, getConfigItemSchema } from './config-item';
import { NonPrimitiveTypes } from './types';

/**
 * 可配置的抽象概念，包含一组配置项。
 */
export type Concept<
    TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>
> = {
    /**
     * 概念名称
     */
    name: string;

    /**
     * 显示名称
     */
    displayName?: string;

    /**
     * 配置项分组
     */
    groups?: ConfigGroups;

    /**
     * 配置项
     */
    items: TItems;

    /**
     * 模板
     */
    templates?: ConceptTemplate[];
};

export type ConceptTemplate = {
    displayName: string;
    model: object;
};

/**
 * 配置项分组信息
 */
export type ConfigGroups = {
    [key: string]: {
        /**
         * 分组所属类别
         */
        aspect?: 'content' | 'design' | 'setting';

        /**
         * 名称
         */
        name: string;
    };
};

/**
 * 定义一个Concept
 */
export function defineConcept<TItems extends Concept['items']>(
    def: Concept<TItems>
) {
    return def;
}

export function getConceptSchema<TConcept extends Concept>(
    concept: TConcept
): z.ZodObject<z.ZodRawShape> {
    return z.object({
        ...mapConfigItems(concept.items),
        $type: z.literal(NonPrimitiveTypes.concept),
        $concept: z.string(),
    });
}

function mapConfigItems(items: Record<string, ConfigItem>) {
    return Object.entries(items).reduce(
        (acc, [key, item]) => ({
            ...acc,
            [key]: getConfigItemSchema(item),
        }),
        {}
    );
}
