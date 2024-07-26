import { defineConcept } from '@hayadev/configurator';
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
            name: '选项',
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

        /**
         * 补充输入的提示语
         */
        additionalInputPlaceholder: {
            type: 'if',

            // 仅在需要用户输入补充回答时显示
            conditionProvider: ({ currentModel }) => !!currentModel.additionalInput,

            name: '补充输入的提示语',
            child: {
                type: 'text',
                name: '提示语（Placeholder）',
                help: 'Placeholder，帮助用户简单理解操作要求或呼吁用户行动',
            },
        },

        additionalInputRequired: {
            type: 'if',
            // 仅在需要用户输入补充回答时显示
            conditionProvider: ({ currentModel }) => !!currentModel.additionalInput,
            name: '补充输入是否必填',
            child: {
                type: 'switch',
                name: '补充选项是否必填',
            },
        },
    },

    summary: ({ currentModel }) => currentModel.value as string,
});
