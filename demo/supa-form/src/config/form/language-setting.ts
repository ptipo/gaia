import { defineConcept } from '@gaia/configurator';

/**
 * 语言设置
 */
export const LanguageSetting = defineConcept({
    name: 'LanguageSetting',
    displayName: '选择语言',

    items: {
        /**
         * 选择语言
         */
        language: {
            type: 'select',
            options: {
                'zh-CN': '简体中文',
                'en-US': 'English',
                'ja-JP': '日本語',
            },
            help: '系统提示语言将按照系统提示语言展示',
        },
    },
});
