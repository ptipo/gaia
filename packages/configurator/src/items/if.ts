import { ConfigItem, getConfigItemSchema } from '../config-item';
import { ConfigItemBase, ProviderContext } from './common';

/**
 * 条件配置项
 */
export interface IfItem extends ConfigItemBase {
    type: 'if';

    /**
     * 根据当前配置上下文计算条件是否满足
     */
    condition: (context: ProviderContext) => boolean;

    /**
     * 满足条件时包含的配置项
     */
    child: ConfigItem;
}

export const getSchema = (item: ConfigItemBase) =>
    getConfigItemSchema((item as IfItem).child).optional();
