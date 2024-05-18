import {
    ColorItem,
    DynamicSelectItem,
    GroupItem,
    HasItem,
    HasManyItem,
    IfItem,
    ImageItem,
    LogicGroupItem,
    NumberItem,
    Schemas,
    SelectItem,
    SwitchItem,
    TextItem,
} from './items';

/**
 * 配置项
 */
export type ConfigItem =
    | ColorItem
    | DynamicSelectItem<any>
    | GroupItem
    | TextItem
    | NumberItem
    | SwitchItem
    | SelectItem
    | ImageItem
    | HasItem
    | HasManyItem
    | IfItem
    | LogicGroupItem;

/**
 * 配置项类型
 */
export type ConfigItemType = ConfigItem['type'];

export function getConfigItemSchema(item: ConfigItem) {
    return Schemas[item.type](item);
}
