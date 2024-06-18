import {
    Schemas,
    type ColorItem,
    type ConfigItemBase,
    type DynamicSelectItem,
    type GetSchemaContext,
    type GroupItem,
    type HasItem,
    type HasManyItem,
    type IfItem,
    type ImageItem,
    type LogicalGroupItem,
    type NumberItem,
    type SelectItem,
    type SwitchItem,
    type TextItem,
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
export function makeConfigItemSchema(item: ConfigItemBase, context: GetSchemaContext) {
    return Schemas[item.type](item, context);
}
