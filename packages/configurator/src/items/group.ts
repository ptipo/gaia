import { z } from 'zod';
import { ConfigItem, getConfigItemSchema } from '../config-item';
import { ConfigItemBase } from './common';
import { ConfigGroups } from '..';

/**
 * 一组配置项
 */
export interface GroupItem<
    TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>
> extends ConfigItemBase {
    type: 'group';

    /**
     * 显示名称
     */
    displayName?: string;

    /**
     * 配置项
     */
    items: TItems;

    /**
     * 帮助信息
     */
    help?: string;

    /**
     * 是否内联展示
     */
    inline?: boolean;

    /**
     * 配置组
     */
    groups?: ConfigGroups;

    /**
     * 当前配置项在容器中所属配置组
     */
    groupKey?: string;
}

/**
 * 创建一个GroupItem
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
