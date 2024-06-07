import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * 开关配置项
 */
export interface SwitchItem extends ConfigItemBase {
    type: 'switch';

    /**
     * 默认值
     */
    default?: boolean;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as SwitchItem;
    return myItem.default !== undefined ? z.boolean().default(myItem.default) : wrap(item, z.boolean());
};
