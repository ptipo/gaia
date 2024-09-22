import { ZodSchema } from 'zod';
import { ProviderContext } from '..';
import { ConfigItemType } from '../config-item';
import { getSchema as getCodeItemSchema } from './code';
import { getSchema as getColorItemSchema } from './color';
import { ConfigItemBase } from './common';
import { getSchema as getDynamicSelectItemSchema } from './dynamic-select';
import { getSchema as getGroupItemSchema } from './group';
import { getSchema as getHasItemSchema } from './has';
import { getSchema as getHasManyItemSchema } from './has-many';
import { getSchema as getIfItemSchema } from './if';
import { getSchema as getImageItemSchema } from './image';
import { getSchema as getLogicalGroupItemSchema } from './logical-group';
import { getSchema as getNumberItemSchema } from './number';
import { getSchema as getSelectItemSchema } from './select';
import { getSchema as getSwitchItemSchema } from './switch';
import { getSchema as getTextItemSchema } from './text';
import { getSchema as getMultipleSelectItemSchema } from './multiple-select';

/**
 * Context for building a Zod schema for validating a config item.
 */
export type GetSchemaContext = ProviderContext & {
    /**
     * Parent model of the config item.
     */
    parentModel: any;

    /**
     * If obvious errors should be fixed automatically.
     */
    autoFix?: boolean;
};

/**
 * Function that gets a Zod schema for validating the model of a config item.
 */
export type GetSchemaFunction = (item: ConfigItemBase, context: GetSchemaContext) => ZodSchema;

export const Schemas: {
    [Key in ConfigItemType]: GetSchemaFunction;
} = {
    color: getColorItemSchema,
    'dynamic-select': getDynamicSelectItemSchema,
    group: getGroupItemSchema,
    'has-many': getHasManyItemSchema,
    has: getHasItemSchema,
    if: getIfItemSchema,
    image: getImageItemSchema,
    'logical-group': getLogicalGroupItemSchema,
    number: getNumberItemSchema,
    select: getSelectItemSchema,
    switch: getSwitchItemSchema,
    text: getTextItemSchema,
    code: getCodeItemSchema,
    'multiple-select': getMultipleSelectItemSchema,
};

export { Code, CodeItem, CodeLanguage } from './code';
export { RGBA, ColorItem } from './color';
export * from './common';
export { DynamicSelectItem, DynamicSelectOption } from './dynamic-select';
export { defineGroupItem, GroupItem } from './group';
export { HasItem } from './has';
export { HasManyItem } from './has-many';
export { IfItem } from './if';
export { ImageInfo, ImageItem } from './image';
export {
    LogicalGroup,
    LogicalGroupAssociation,
    LogicalGroupItem,
    LogicalLeftOperandCandidates,
    LogicalOperator,
    LogicalRightOperandCandidates,
} from './logical-group';
export { NumberItem } from './number';
export { SelectItem } from './select';
export { SwitchItem } from './switch';
export { TextItem } from './text';
export { MultipleSelectItem } from './multiple-select';
