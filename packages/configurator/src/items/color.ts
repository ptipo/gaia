import { z } from 'zod';
import type { GetSchemaFunction } from '.';
import { wrap } from '../schema';
import type { ConfigItemBase } from './common';

/**
 * RGBA color.
 */
export type RGBA = `rgba(${number},${number},${number},${number})`;

/**
 * Checks if the input is a valid RGBA color.
 */
export function isRGBA(input: unknown): input is string {
    if (typeof input !== 'string') {
        return false;
    } else {
        return /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*\d(\.\d+)?\)$/.test(input);
    }
}

/**
 * 颜色配置项
 */
export interface ColorItem extends ConfigItemBase {
    type: 'color';

    /**
     * 默认值
     */
    default?: RGBA;
}

export const getSchema: GetSchemaFunction = (item: ConfigItemBase) => wrap(item, z.custom<RGBA>(isRGBA));
