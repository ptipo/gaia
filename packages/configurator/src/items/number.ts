import { z } from 'zod';
import { ConfigItemBase } from './common';

/**
 * 数字配置项
 */
export interface NumberItem extends ConfigItemBase {
    type: 'number';

    /**
     * 是否支持浮点
     */
    allowFloat?: boolean;

    /**
     * 是否支持负数
     */
    allowNegative?: boolean;

    /**
     * 默认值
     */
    default?: number;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as NumberItem;
    let result = z.number();
    if (!myItem.allowFloat) {
        result = result.int();
    }
    if (!myItem.allowNegative) {
        result = result.positive();
    }
    return myItem.default !== undefined
        ? result.default(myItem.default)
        : result;
};
