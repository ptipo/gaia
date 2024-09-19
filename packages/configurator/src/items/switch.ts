import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Config item representing an ON/OFF switch.
 */
export interface SwitchItem extends ConfigItemBase {
    type: 'switch';

    /**
     * Default value
     */
    default?: boolean;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as SwitchItem;
    return myItem.default !== undefined ? z.boolean().default(myItem.default) : wrap(item, z.boolean());
};
