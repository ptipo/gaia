import { z } from 'zod';
import { wrap } from '../schema';
import { RGBA, isRGBA } from '../types';
import { ConfigItemBase } from './common';

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

export const getSchema = (item: ConfigItemBase) => wrap(item, z.custom<RGBA>(isRGBA));
