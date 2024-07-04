import {
    type BaseConceptModel,
    defineConcept,
    type inferPartialConcept,
    type ValidationIssue,
    ValidationIssueCode,
} from '@hayadev/configurator';
import { ChoiceQuestion, ImageElement, TextElement } from '../page-items';
import { TextChoice } from '../page-items/question/text-choice';
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
            name: '表单页',
            required: true,
            candidates: [ContentPage],
            inline: true,
            groupKey: 'contentPages',
            newItemProvider: (concept, context) => {
                const { app, currentModel } = context;
                const existing = currentModel.filter((item: BaseConceptModel) => item.$concept === concept.name);
                return app.createConceptInstance(ContentPage, {
                    name: `表单页${existing.length + 1}`,
                    pageItems: [
                        app.createConceptInstance(ChoiceQuestion, {
                            name: '选择1',
                            question: '选择1',
                            kind: 'single',
                            choiceKind: 'text',
                            textChoices: [
                                app.createConceptInstance(TextChoice, {
                                    value: 'A',
                                    defaultSelected: true,
                                }),
                                app.createConceptInstance(TextChoice, {
                                    value: 'B',
                                }),
                                app.createConceptInstance(TextChoice, {
                                    value: 'C',
                                }),
                                app.createConceptInstance(TextChoice, {
                                    value: 'D',
                                }),
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
            newItemProvider: (concept, context) => {
                const { app, currentModel } = context;
                const existing = currentModel.filter((item: BaseConceptModel) => item.$concept === concept.name);
                return app.createConceptInstance(CompletePage, {
                    name: `结束页${existing.length + 1}`,
                    pageItems: [
                        app.createConceptInstance(TextElement, {
                            content: '标题',
                        }),
                        app.createConceptInstance(ImageElement, {
                            image: { $type: 'image', url: 'https://via.placeholder.com/150' },
                        }),
                        app.createConceptInstance(TextElement, {
                            content: '说明文字',
                        }),
                    ],
                });
            },
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

    validate: (model) => {
        const issues: ValidationIssue[] = [];
        issues.push(...validateDuplicatedQuestionNames(model as inferPartialConcept<typeof Form>));
        return issues;
    },
});

function validateDuplicatedQuestionNames(model: inferPartialConcept<typeof Form>) {
    const issues: ValidationIssue[] = [];

    model.contentPages.forEach((page, pageIndex) => {
        const knownQuestionNames = new Set<string>();
        page.pageItems.forEach((item, itemIndex) => {
            if (['ChoiceQuestion', 'QAQuestion', 'EmailQuestion'].includes(item.$concept)) {
                if (!item.name || typeof item.name !== 'string') {
                    return;
                }
                const name = item.name.trim();
                if (knownQuestionNames.has(name)) {
                    issues.push({
                        code: ValidationIssueCode.InvalidValue,
                        message: `问题名称"${name}"重复`,
                        path: ['contentPages', pageIndex, 'pageItems', itemIndex, 'name'],
                    });
                } else {
                    knownQuestionNames.add(name);
                }
            }
        });
    });

    return issues;
}
