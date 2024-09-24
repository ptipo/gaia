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
     * Item description (for documentation purpose only)
     */
    description?: string;

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

    /**
     * If the item is preferably displayed inline
     */
    inline?: boolean;
}
