import { BaseConceptModel, inferConfigItem } from '@/inference';
import type { ProviderContext } from '@/types';
import { z } from 'zod';
import { GetSchemaContext } from '.';
import { makeConfigItemSchema, type ConfigItem } from '../config-item';
import type { ConfigItemBase } from './common';

/**
 * A conditional config item.
 */
export interface IfItem extends ConfigItemBase {
    type: 'if';

    /**
     * Callback for computing the condition
     */
    conditionProvider: (context: ProviderContext) => boolean;

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
        condition = myItem.conditionProvider({
            app: context.app,
            rootModel: context.rootModel,
            currentModel: context.parentModel,
        });
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
