import type { inferConfigItem } from '@gaia/configurator';
import type { ConfigItemBase } from '@gaia/configurator/items';
import type { SelectionData } from '../types';

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
    (e: 'selectionChange', data: SelectionData): void;
    (e: 'drop'): void;
};
