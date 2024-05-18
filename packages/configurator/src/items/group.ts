import { z } from 'zod';
import { ConfigItem, getConfigItemSchema } from '../config-item';
import { ConfigItemBase } from './common';

export interface GroupItem extends ConfigItemBase {
    type: 'group';
    items: Record<string, ConfigItem>;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as GroupItem;
    return z.object(
        Object.entries(myItem.items).reduce(
            (acc, [key, item]) => ({
                ...acc,
                [key]: getConfigItemSchema(item),
            }),
            {}
        )
    );
};
