import type { ProviderContext } from '@/types';
import { z } from 'zod';
import type { GetSchemaFunction } from '.';
import { wrap } from '../schema';
import type { ConfigItemBase } from './common';

/**
 * A dynamic select option.
 */
export type DynamicSelectOption<TValue> = {
    /**
     * Unique key
     */
    key: number | string;

    /**
     * Display label
     */
    label: string;

    /**
     * Value
     */
    value: TValue;

    /**
     * Group name
     */
    group?: string;
};

/**
 * Config item that provides a dynamically loaded list of options.
 */
export interface DynamicSelectItem<TValue> extends ConfigItemBase {
    type: 'dynamic-select';

    /**
     * Callback for computing options.
     */
    provider: (context: ProviderContext) => DynamicSelectOption<TValue>[] | Promise<DynamicSelectOption<TValue>[]>;
}

// TODO: call items provider and build a stricter Zod schema
export const getSchema: GetSchemaFunction = (item: ConfigItemBase) =>
    wrap(
        item,
        z.custom(
            (data) => {
                return data !== undefined;
            },
            { message: '未设置' }
        )
    );
