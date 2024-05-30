import { z } from 'zod';
import { ConfigItem, getConfigItemSchema } from '../config-item';
import { ConfigItemBase } from './common';
import { ConfigGroups } from '..';

/**
 * An item that groups other items.
 */
export interface GroupItem<
    TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>
> extends ConfigItemBase {
    type: 'group';

    /**
     * Child items
     */
    items: TItems;

    /**
     * Help text
     */
    help?: string;

    /**
     * If the group items should be rendered inline
     */
    inline?: boolean;

    /**
     * Grouping information
     */
    groups?: ConfigGroups;

    /**
     * Group key for deciding which group in the parent item this item
     * should be placed in
     */
    groupKey?: string;
}

/**
 * Defines a group item.
 */
export function defineGroupItem<TItems extends Record<string, ConfigItem>>(
    def: Omit<GroupItem<TItems>, 'type'>
): GroupItem<TItems> {
    return { type: 'group', ...def };
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
