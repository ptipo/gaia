import { z } from 'zod';
import { ConfigItemBase } from './common';

/**
 * 固定选择配置项
 */
export interface SelectItem<TKey extends string = string>
    extends ConfigItemBase {
    type: 'select';

    /**
     * 候选项
     */
    options: Record<TKey, string>;

    /**
     * 默认值
     */
    default?: string;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as SelectItem;
    return myItem.default !== undefined
        ? z.string().default(myItem.default)
        : z.string();
};
