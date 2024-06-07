import { ProviderContext } from '@/types';
import { z } from 'zod';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

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

export const getSchema = (item: ConfigItemBase) =>
    wrap(
        item,
        z.custom(
            (data) => {
                console.log(item);
                return data !== undefined;
            },
            { message: '未设置' }
        )
    );
