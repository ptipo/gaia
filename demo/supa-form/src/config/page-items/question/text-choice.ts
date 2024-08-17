import { defineConcept, t } from '@hayadev/configurator';
/**
 * 文字选项
 */
export const TextChoice = defineConcept({
    name: 'TextChoice',
    displayName: t`textOption`,

    items: {
        /**
         * 内容
         */
        value: {
            type: 'text',
            name: t`choiceOption`,
            required: true,
        },

        /**
         * 默认选中
         */
        defaultSelected: {
            type: 'switch',
            name: t`defaultSelected`,
        },

        /**
         * 需要用户输入补充回答
         */
        additionalInput: {
            type: 'switch',
            name: t`additionalInput`,
        },

        /**
         * 补充输入的提示语
         */
        additionalInputPlaceholder: {
            type: 'if',
            description: 'Placeholder for additional input. Only valid when the "additionalInput" field is true.',

            // 仅在需要用户输入补充回答时显示
            condition: { field: 'additionalInput', value: true },

            name: t`additionalInputPlaceholder`,
            child: {
                type: 'text',
                name: t`placeholder`,
                help: t`placeholderHelp`,
            },
        },

        additionalInputRequired: {
            type: 'if',
            description: 'Whether additional input is required. Only valid when the "additionalInput" field is true.',

            // 仅在需要用户输入补充回答时显示
            condition: { field: 'additionalInput', value: true },

            name: t`additionalInputRequired`,
            child: {
                type: 'switch',
                name: t`additionalInputRequired`,
            },
        },
    },

    summary: ({ currentModel }) => (currentModel?.value as string) ?? '',
});
