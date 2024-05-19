import { z } from 'zod';
import { NonPrimitiveTypes } from '../types';

/**
 * 图片资源配置项
 */
export type ImageItem = {
    type: 'image';
};

export const getSchema = () =>
    z.object({
        $type: z.literal(NonPrimitiveTypes.image),
        url: z.string(),
        width: z.number().positive(),
        height: z.number().positive(),
    });

export type ImageInfo = z.infer<ReturnType<typeof getSchema>>;
