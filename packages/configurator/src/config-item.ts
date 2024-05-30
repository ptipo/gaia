import {
    ColorItem,
    ConfigItemBase,
    DynamicSelectItem,
    GroupItem,
    HasItem,
    HasManyItem,
    IfItem,
    ImageItem,
    LogicalGroupItem,
    NumberItem,
    Schemas,
    SelectItem,
    SwitchItem,
    TextItem,
} from './items';

/**
 * All config items
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
    | LogicalGroupItem;

/**
 * Types of config items
 */
export type ConfigItemType = ConfigItem['type'];

/**
 * Gets a Zod schema for validating the model of a config item
 */
export function getConfigItemSchema(item: ConfigItemBase) {
    return Schemas[item.type](item);
}
