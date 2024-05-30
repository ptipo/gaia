import { ConfigItemType } from '..';

/**
 * Common fields of config items.
 */
export interface ConfigItemBase {
    /**
     * Item type
     */
    type: ConfigItemType;

    /**
     * Item name
     */
    name?: string;

    /**
     * If the item is required
     */
    required?: boolean;

    /**
     * Help text
     */
    help?: string;

    /**
     * If the item is guarded
     */
    guarded?: boolean;

    /**
     * Item's group key
     */
    groupKey?: string;
}
