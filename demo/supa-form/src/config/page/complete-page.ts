import { defineConcept } from '@gaia/configurator';
import { ImageElement, TextElement } from '../page-items';

/**
 * 结束页
 */
export const CompletePage = defineConcept({
    name: 'CompletePage',
    displayName: '结束页',

    items: {
        /**
         * 页面名称
         */
        name: { type: 'text', name: '页面名称' },

        /**
         * 页面内容项
         */
        pageItems: {
            type: 'has-many',
            name: '内容项',
            candidates: [TextElement, ImageElement],
        },
    },

    selectable: true,
});
