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
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
    });

/**
 * 图片资源信息
 */
export type ImageInfo = Omit<z.infer<ReturnType<typeof getSchema>>, '$type'>;
