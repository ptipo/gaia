import { z } from 'zod';
import { ConfigItemBase, ProviderContext } from './common';

/**
 * 动态选项
 */
export type DynamicSelectOption<TValue> = {
    /**
     * 唯一标识
     */
    key: number | string;

    /**
     * 显示文本
     */
    label: string;

    /**
     * 值
     */
    value: TValue;

    /**
     * 分组
     */
    group?: string;
};

/**
 * 动态选择配置项，根据当前配置上下文计算候选项
 */
export interface DynamicSelectItem<TValue> extends ConfigItemBase {
    type: 'dynamic-select';

    /**
     * 计算配置项列表
     */
    provider: (
        context: ProviderContext
    ) => DynamicSelectOption<TValue>[] | Promise<DynamicSelectOption<TValue>[]>;
}

export const getSchema = () =>
    z.array(
        z.object({
            label: z.string(),
            value: z.any(),
            group: z.string().optional(),
        })
    );
