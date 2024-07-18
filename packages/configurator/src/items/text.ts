import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * 文本配置项
 */
export interface TextItem extends ConfigItemBase {
    type: 'text';

    /**
     * 占位文本
     */
    placeholder?: string;

    /**
     * 输入类型
     */
    kind?: 'text' | 'email' | 'phone';

    /**
     * 默认值
     */
    default?: string;

    /**
     * 是否为富文本
     */
    richText?: boolean;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as TextItem;

    let result = z.string();
    if (myItem.required) {
        result = result.min(1);
    }

    switch (myItem.kind) {
        case 'text':
            break;
        case 'email':
            result = result.email();
            break;
        case 'phone':
            // TODO: validate phone number
            break;
        default:
            break;
    }

    return myItem.default !== undefined ? result.default(myItem.default) : wrap(item, result);
};
