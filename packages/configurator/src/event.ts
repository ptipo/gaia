import type { SelectionData } from './types';

/**
 * Event name for selection change.
 */
export const SELECTION_CHANGE_EVENT = 'selection-change';

/**
 * Creates a selection change event.
 */
export function createSelectionChangeEvent(data: SelectionData) {
    return new CustomEvent(SELECTION_CHANGE_EVENT, { detail: data, bubbles: true, composed: true });
}
