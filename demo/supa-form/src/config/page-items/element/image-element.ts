import { defineConcept } from '@hayadev/configurator';
import { AlignmentItems } from '../common';

/**
 * 图片元素
 */
export const ImageElement = defineConcept({
    name: 'ImageElement',
    displayName: '图片',

    items: {
        /**
         * 图片
         */
        image: { type: 'image' },

        source: { type: 'text', name: '来源' },

        ...AlignmentItems,
    },
});
