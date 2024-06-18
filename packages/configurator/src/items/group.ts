import { z } from 'zod';
import type { GetSchemaContext } from '.';
import type { ConfigGroups } from '..';
import { makeConfigItemSchema, type ConfigItem } from '../config-item';
import { wrap } from '../schema';
import type { ConfigItemBase } from './common';

/**
 * An item that groups other items.
 */
export interface GroupItem<TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>>
    extends ConfigItemBase {
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

export const getSchema = (item: ConfigItemBase, context: GetSchemaContext) => {
    const myItem = item as GroupItem;
    return wrap(
        item,
        z.object(
            Object.entries(myItem.items).reduce(
                (acc, [key, item]) => ({
                    ...acc,
                    [key]: makeConfigItemSchema(item, {
                        ...context,
                        parentModel: context.currentModel,
                        currentModel: context.currentModel[key],
                    }),
                }),
                {}
            )
        )
    );
};
