import { ProviderContext } from '@/types';
import { ConfigItem, makeConfigItemSchema } from '../config-item';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

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
     * Child item that'll be rendered if the condition is met
     */
    child: ConfigItem;
}

export const getSchema = (item: ConfigItemBase) => wrap(item, makeConfigItemSchema((item as IfItem).child));
