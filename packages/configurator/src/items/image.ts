import { z } from 'zod';
import { NonPrimitiveTypes } from '../types';
import { ConfigItemBase } from './common';

/**
 * 图片资源配置项
 */
export interface ImageItem extends ConfigItemBase {
    type: 'image';
}

export const getSchema = () =>
    z.object({
        $type: z.literal(NonPrimitiveTypes.image),
        url: z.string(),
        width: z.number().positive(),
        height: z.number().positive(),
    });

/**
 * 图片资源信息
 */
export type ImageInfo = z.infer<ReturnType<typeof getSchema>>;
