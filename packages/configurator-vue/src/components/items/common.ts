import type { inferConfigItem } from '@gaia/configurator';
import type { ConfigItemBase } from '@gaia/configurator/items';

/**
 * Props for all config items.
 */
export type CommonProps<TItem extends ConfigItemBase> = {
    item: TItem;
    model: inferConfigItem<TItem>;
};

/**
 * Events for all config items.
 */
export type CommonEvents<TItem extends ConfigItemBase> = {
    (e: 'change', data: inferConfigItem<TItem>): void;
};
