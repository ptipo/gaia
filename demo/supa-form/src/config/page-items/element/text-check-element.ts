import { defineConcept } from '@hayadev/configurator';

/**
 * 文本元素
 */
export const TextCheckElement = defineConcept({
    name: 'TextCheckElement',
    displayName: '隐私协议',

    items: {
        /**
         * 内容
         */
        content: { type: 'text', name: '内容', richText: true },

        /**
         * 开启
         */
        defaultSelected: { type: 'switch', name: '默认选中' },
    },
});
