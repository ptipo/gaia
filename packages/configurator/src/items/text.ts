import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Text configuration item
 */
export interface TextItem extends ConfigItemBase {
    type: 'text';

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Input kind
     */
    kind?: 'text' | 'email' | 'phone';

    /**
     * Default value
     */
    default?: string;

    /**
     * If rich text is allowed
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
