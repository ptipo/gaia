import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Number configuration item
 */
export interface NumberItem extends ConfigItemBase {
    type: 'number';

    /**
     * If float point number is allowed
     */
    allowFloat?: boolean;

    /**
     * If negative number is allowed
     */
    allowNegative?: boolean;

    /**
     * Default value
     */
    default?: number;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as NumberItem;
    let result = z.number();
    if (!myItem.allowFloat) {
        result = result.int();
    }
    if (!myItem.allowNegative) {
        result = result.positive();
    }
    return myItem.default !== undefined ? result.default(myItem.default) : wrap(item, result);
};
