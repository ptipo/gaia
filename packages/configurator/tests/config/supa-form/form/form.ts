import { defineConcept } from '@gaia/configurator';
import { CompletePage } from '../page/complete-page';
import { ContentPage } from '../page/content-page';
import { DataCollectionSetting } from './data-collection-setting';
import { LanguageSetting } from './language-setting';

/**
 * 表单
 */
export const Form = defineConcept({
    name: 'Form',
    displayName: '表单',

    groups: {
        contentPages: { name: '表单页', aspect: 'content' },
        completePages: { name: '结束页', aspect: 'content' },
        language: { name: '语言', aspect: 'setting' },
        dataCollection: { name: '表单信息收集', aspect: 'setting' },
    },

    items: {
        /**
         * 表单页列表，inline展示
         */
        contentPages: {
            type: 'has-many',
            candidates: [ContentPage],
            inline: true,
            groupKey: 'contentPages',
        },

        /**
         * 结束页列表，inline展示
         */
        completePages: {
            type: 'has-many',
            candidates: [CompletePage],
            inline: true,
            groupKey: 'completePages',
        },

        /**
         * 下一步按钮文案
         */
        nextButtonText: {
            type: 'text',
            name: '下一步按钮文案',
            default: '下一步',
        },

        /**
         * 提交按钮文案
         */
        submitButtonText: {
            type: 'text',
            name: '提交按钮文案',
            default: '提交',
        },

        /**
         * 语言设置
         */
        languageSettings: LanguageSetting,

        /**
         * 表单信息收集
         */
        dataCollection: DataCollectionSetting,
    },
});
