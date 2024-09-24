import type { BaseConceptModel, inferConfigItem, SelectionData } from '@hayadev/configurator';
import type { ConfigItemBase } from '@hayadev/configurator/items';

/**
 * Props for all config items.
 */
export type CommonProps<TItem extends ConfigItemBase> = {
    item: TItem;
    model: inferConfigItem<TItem>;
    parentModel: BaseConceptModel;
};

/**
 * Events for all config items.
 */
export type CommonEvents<TItem extends ConfigItemBase> = {
    (e: 'change', data: inferConfigItem<TItem>): void;
    (e: 'selectionChange', data: SelectionData): void;
    (e: 'drop'): void;
};
