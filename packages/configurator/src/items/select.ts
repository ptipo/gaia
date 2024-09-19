import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Config item representing a fixed set of options.
 */
export interface SelectItem<TKey extends string = string> extends ConfigItemBase {
    type: 'select';

    /**
     * Options
     */
    options: Record<TKey, string>;

    /**
     * Default value
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
