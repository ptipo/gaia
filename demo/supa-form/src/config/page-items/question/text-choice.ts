import { defineConcept } from '@gaia/configurator';
/**
 * 文字选项
 */
export const TextChoice = defineConcept({
    name: 'TextChoice',
    displayName: '文字选项',

    items: {
        /**
         * 内容
         */
        value: {
            type: 'text',
            required: true,
        },

        /**
         * 默认选中
         */
        defaultSelected: {
            type: 'switch',
            name: '默认选中',
        },

        /**
         * 需要用户输入补充回答
         */
        additionalInput: {
            type: 'switch',
            name: '选择后，需要用户输入补充回答',
        },
    },

    summary: (model) => model.value as string,
});
