import { ConfigItemBase } from './common';
import { wrap } from '../schema';
import { z } from 'zod';

export interface MultipleSelectItem<TKey extends string = string> extends ConfigItemBase {
    type: 'multiple-select';
    options: Record<TKey, string>;
    allowCreate?: boolean;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as MultipleSelectItem;
    if (myItem.allowCreate) {
        return wrap(item, z.array(z.string()));
    } else {
        return wrap(
            item,
            z
                .string()
                .refine((value) => value in myItem.options, { message: 'Invalid option' })
                .array()
        );
    }
};
