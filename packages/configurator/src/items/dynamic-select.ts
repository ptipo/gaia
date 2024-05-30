import { z } from 'zod';
import { ConfigItemBase } from './common';
import { ProviderContext } from '@/types';

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
    provider: (
        context: ProviderContext
    ) => DynamicSelectOption<TValue>[] | Promise<DynamicSelectOption<TValue>[]>;
}

export const getSchema = () =>
    z.array(
        z.object({
            label: z.string(),
            value: z.any(),
            group: z.string().optional(),
        })
    );
