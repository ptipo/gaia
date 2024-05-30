import { z } from 'zod';
import { ConfigItemType } from '../config-item';
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

export const Schemas: {
    [Key in ConfigItemType]: (item: ConfigItemBase) => z.ZodTypeAny;
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
};

export { ColorItem } from './color';
export * from './common';
export { DynamicSelectItem, DynamicSelectOption } from './dynamic-select';
export { GroupItem, defineGroupItem } from './group';
export { HasItem } from './has';
export { HasManyItem } from './has-many';
export { IfItem } from './if';
export { ImageInfo, ImageItem } from './image';
export {
    LogicalGroup,
    LogicalGroupItem,
    LogicalLeftOperandCandidates,
    LogicalOperator,
    LogicalRightOperandCandidates,
} from './logical-group';
export { NumberItem } from './number';
export { SelectItem } from './select';
export { SwitchItem } from './switch';
export { TextItem } from './text';
