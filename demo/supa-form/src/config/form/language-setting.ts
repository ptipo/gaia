import { t } from '@hayadev/configurator';
import { defineGroupItem } from '@hayadev/configurator/items';

/**
 * 语言设置
 */
export const LanguageSetting = defineGroupItem({
    items: {
        /**
         * 选择语言
         */
        language: {
            type: 'select',
            name: t`selectLanguage`,
            options: {
                'zh-CN': '简体中文',
                'en-US': 'English',
                'ja-JP': '日本語',
                'fr-FR': 'Français',
                'de-DE': 'Deutsch',
            },
            help: t`languageHelp`,
        },
    },

    groupKey: 'language',
});
