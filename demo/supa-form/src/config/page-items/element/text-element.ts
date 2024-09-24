import { defineConcept, t } from '@hayadev/configurator';
import { AlignmentItems } from '../common';

/**
 * 文本元素
 */
export const TextElement = defineConcept({
    name: 'TextElement',
    displayName: t`text`,

    items: {
        /**
         * 类型
         */
        kind: {
            type: 'select',
            name: t`type`,
            default: 'text',
            options: {
                h1: t`h1Heading`,
                h2: t`h2Heading`,
                h3: t`h3Heading`,
                text: t`prose`,
            },
        },

        /**
         * 内容
         */
        content: { type: 'text', name: t`content`, richText: true },

        ...AlignmentItems,
    },
});
