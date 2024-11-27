import { defineConcept, t } from '@hayadev/configurator';
import { AlignmentItems, getAlignConfig } from '../common';

/**
 * 图片元素
 */
export const ImageElement = defineConcept({
    name: 'ImageElement',
    displayName: t`image`,

    items: {
        /**
         * 图片
         */
        image: {
            type: 'image',
            name: t`image`,
            default: 'https://comp.ptengine.com/res/placeholder-lg.svg',
            required: true,
        },

        ...getAlignConfig('left'),

        widthUnit: {
            type: 'select',
            name: t`widthUnit`,
            options: { percentage: '%', px: 'px' },
            default: 'percentage',
        },

        maxWidth: { type: 'number', name: t`maxWidth`, default: 100 },
    },
});
