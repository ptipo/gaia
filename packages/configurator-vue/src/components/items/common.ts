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

/**
 * Predefined colors.
 */
export const PredefinedColors = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
];
