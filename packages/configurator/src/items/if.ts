import { inferConfigItem } from '@/inference';
import type { ProviderContext } from '@/types';
import { z } from 'zod';
import { GetSchemaContext } from '.';
import { makeConfigItemSchema, type ConfigItem } from '../config-item';
import type { ConfigItemBase } from './common';

/**
 * A simple field=value condition.
 */
export type SimpleCondition = {
    field: string;
    value: string | number | boolean;
};

/**
 * A conditional config item.
 */
export interface IfItem extends ConfigItemBase {
    type: 'if';

    /**
     * Simple `field=value` condition. If this is set, `conditionProvider` will be ignored.
     */
    condition?: SimpleCondition;

    /**
     * Callback for computing the condition
     */
    conditionProvider?: (context: ProviderContext) => boolean;

    /**
     * Callback for handling condition changes
     * @returns A new model. If undefined, uses default behavior.
     */
    onConditionChange?: (context: ProviderContext, value: boolean) => inferConfigItem<ConfigItem> | undefined;

    /**
     * Child item that'll be rendered if the condition is met
     */
    child: ConfigItem;
}

export const getSchema = (item: ConfigItemBase, context: GetSchemaContext) => {
    const myItem = item as IfItem;
    let condition: boolean;
    try {
        if (myItem.condition) {
            condition = context.parentModel?.[myItem.condition.field] === myItem.condition.value;
        } else if (myItem.conditionProvider) {
            condition = myItem.conditionProvider({
                app: context.app,
                rootModel: context.rootModel,
                currentModel: context.parentModel,
            });
        } else {
            throw new Error('No condition or conditionProvider provided');
        }
    } catch (err: any) {
        throw new Error('Error while evaluating if condition: ' + err.message);
    }

    if (condition) {
        // enabled
        return makeConfigItemSchema(myItem.child, context);
    } else {
        // not enabled
        return z.undefined();
    }
};
