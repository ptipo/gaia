import { defineConcept, t } from '@hayadev/configurator';

/**
 * 文本元素
 */
export const TextCheckElement = defineConcept({
    name: 'TextCheckElement',
    displayName: t`privacyTerms`,

    items: {
        /**
         * 内容
         */
        content: { type: 'text', name: t`content`, richText: true },

        /**
         * 开启
         */
        defaultSelected: { type: 'switch', name: t`defaultSelected` },
    },
});
