import { z } from 'zod';
import type { GetSchemaFunction } from '.';
import { wrap } from '../schema';
import { isRGBA, type RGBA } from '../types';
import type { ConfigItemBase } from './common';

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
