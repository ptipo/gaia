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
            candidates: [TextElement, ImageElement],
        },
    },

    templates: [
        {
            displayName: '默认结束页',
            model: {
                name: '新页面',
                pageItems: [
                    {
                        $concept: TextElement,
                        content: '标题',
                    },
                    {
                        $concept: ImageElement,
                        url: 'https://via.placeholder.com/150',
                    },
                    {
                        $concept: TextElement,
                        content: '说明文字',
                    },
                ],
            },
        },
    ],
});
