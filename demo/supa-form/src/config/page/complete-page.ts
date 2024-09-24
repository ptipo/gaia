import { defineConcept, t } from '@hayadev/configurator';
import { CopyToClipboard, ImageElement, TextElement } from '../page-items';

/**
 * 结束页
 */
export const CompletePage = defineConcept({
    name: 'CompletePage',
    displayName: t`completePage`,
    description: 'Page for confirming form submission and thanking the user',

    items: {
        /**
         * 页面名称
         */
        name: { type: 'text', name: t`pageName` },

        /**
         * 页面内容项
         */
        pageItems: {
            type: 'has-many',
            name: t`pageItem`,
            candidates: [TextElement, ImageElement, CopyToClipboard],
        },
    },

    selectable: true,
});
