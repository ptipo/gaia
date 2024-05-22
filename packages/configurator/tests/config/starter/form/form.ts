import { createConceptModel, defineConcept } from '@gaia/configurator';
import { ChoiceQuestion, ImageElement, TextElement } from '../page-items';
import { TextChoice } from '../page-items/question/text-choice';
import { CompletePage } from '../page/complete-page';
import { ContentPage } from '../page/content-page';

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
            name: '表单页',
            candidates: [ContentPage],
            inline: true,
            groupKey: 'contentPages',
            newItemProvider: (concept, model) => {
                const existing = model.filter(
                    (item) => item.$concept === concept.name
                );
                return createConceptModel(ContentPage, {
                    name: `表单页${existing.length + 1}`,
                    pageItems: [
                        createConceptModel(ChoiceQuestion, {
                            name: '问题1',
                            question: '问题1',
                            kind: 'single',
                            choiceKind: 'text',
                            textChoices: [
                                createConceptModel(TextChoice, {
                                    value: 'A',
                                    defaultSelected: true,
                                }),
                                createConceptModel(TextChoice, { value: 'B' }),
                                createConceptModel(TextChoice, { value: 'C' }),
                                createConceptModel(TextChoice, { value: 'D' }),
                            ],
                        }),
                    ],
                });
            },
        },

        /**
         * 结束页列表，inline展示
         */
        completePages: {
            type: 'has-many',
            name: '结束页',
            candidates: [CompletePage],
            inline: true,
            groupKey: 'completePages',
            newItemProvider: (concept, model) => {
                const existing = model.filter(
                    (item) => item.$concept === concept.name
                );
                return createConceptModel(CompletePage, {
                    name: `结束页${existing.length + 1}`,
                    pageItems: [
                        createConceptModel(TextElement, { content: '标题' }),
                        createConceptModel(ImageElement, {
                            image: { url: 'https://via.placeholder.com/150' },
                        }),
                        createConceptModel(TextElement, {
                            content: '说明文字',
                        }),
                    ],
                });
            },
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

        // /**
        //  * 语言设置
        //  */
        // languageSettings: LanguageSetting,

        // /**
        //  * 表单信息收集
        //  */
        // dataCollection: DataCollectionSetting,
    },
});
