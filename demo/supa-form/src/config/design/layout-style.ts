import { defineConcept, t } from '@hayadev/configurator';
import { PartialRange } from '../page-items/common';

export const LayoutStyle = defineConcept({
    name: 'LayoutStyle',
    displayName: t`layoutStyle`,

    items: {
        marginVertical: {
            type: 'select',
            name: t`marginVertical`,
            options: PartialRange,
            groupKey: 'margin',
        },
        marginHorizontal: {
            type: 'select',
            name: t`marginHorizontal`,
            options: PartialRange,
            groupKey: 'margin',
        },
        contentGap: {
            type: 'select',
            name: t`contentGap`,
            options: PartialRange,
            groupKey: 'contentGap',
        },
    },

    groups: { margin: { name: t`margin` }, contentGap: { name: t`contentGap` } },
});
