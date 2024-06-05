import { defineConcept } from '@gaia/configurator';
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
    },
});
