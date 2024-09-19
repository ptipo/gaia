import { z } from 'zod';
import { NonPrimitiveTypes } from '..';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Image configuration item
 */
export interface ImageItem extends ConfigItemBase {
    type: 'image';

    /**
     * Default URL
     */
    default?: string;
}

export const getSchema = (item: ConfigItemBase) => {
    const myItem = item as ImageItem;
    return wrap(
        item,
        z.object({
            $type: z.literal(NonPrimitiveTypes.image),
            url: myItem.default ? z.string().default(myItem.default) : z.string(),
            width: z.number().positive().optional(),
            height: z.number().positive().optional(),
        })
    );
};

/**
 * Image info
 */
export type ImageInfo = z.infer<ReturnType<typeof getSchema>>;
