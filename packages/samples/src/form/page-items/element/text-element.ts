import { defineConcept } from '@hayadev/configurator';
/**
 * 文本元素
 */
export const TextElement = defineConcept({
    name: 'TextElement',
    displayName: '文本',

    items: {
        /**
         * 类型
         */
        kind: {
            type: 'select',
            name: '类型',
            default: 'text',
            options: {
                h1: 'H1标题',
                h2: 'H2标题',
                h3: 'H3标题',
                text: '正文',
            },
        },

        /**
         * 内容
         */
        content: { type: 'text', name: '内容', multiline: true },
    },
});
