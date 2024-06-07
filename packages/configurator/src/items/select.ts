import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * 固定选择配置项
 */
export interface SelectItem<TKey extends string = string> extends ConfigItemBase {
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
    if (myItem.default !== undefined) {
        return z
            .string()
            .default(myItem.default)
            .refine((value) => value in myItem.options, { message: 'Invalid option' });
    } else {
        return wrap(
            item,
            z.string().refine((value) => value in myItem.options, { message: 'Invalid option' })
        );
    }
};
