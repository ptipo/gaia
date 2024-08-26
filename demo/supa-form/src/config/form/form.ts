import { type BaseConceptModel, Concept, ConfigItem, defineConcept, t, NonPrimitiveTypes } from '@hayadev/configurator';
import { CodeLanguage } from '@hayadev/configurator/items';
import { ChoiceQuestion, ImageElement, TextElement } from '../page-items';
import { CompletePage } from '../page/complete-page';
import { ContentPage } from '../page/content-page';
import { DataCollectionSetting } from './data-collection-setting';
import { LanguageSetting } from './language-setting';
import { QuestionStyle } from '../design/question-style';
import { generalStyle } from '../design/general-style';
import { answerChoiceStyle } from '../design/answer-choice-style';

/**
 * 表单
 */
export const Form = defineConcept({
    name: 'Form',
    displayName: t`form`,
    description: 'Survey form',

    groups: {
        contentPages: { name: t`contentPage`, aspect: 'content' },
        completePages: { name: t`completePage`, aspect: 'content' },
        language: { name: t`language`, aspect: 'setting' },
        dataCollection: { name: t`dataCollection`, aspect: 'setting' },
        style: { name: t`styles`, aspect: 'design' },
    },

    items: {
        /**
         * 表单页列表，inline展示
         */
        contentPages: {
            type: 'has-many',
            name: t`contentPage`,
            description: 'Pages for collecting user input',
            required: true,
            candidates: [ContentPage],
            inline: true,
            groupKey: 'contentPages',
            newItemProvider: (concept, context) => {
                const { app, currentModel, ct } = context;
                const existing = currentModel?.filter((item: BaseConceptModel) => item.$concept === concept.name) ?? [];
                return app.createConceptInstance(ContentPage, {
                    name: `${ct(t`contentPage`)}${existing.length + 1}`,
                    pageItems: [
                        app.createConceptInstance(ChoiceQuestion, {
                            name: `${ct(t`choice`)}1`,
                            question: `${ct(t`choice`)}1`,
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
            name: t`completePage`,
            description: 'Pages for confirming form submission and thanking the user',
            candidates: [CompletePage],
            inline: true,
            groupKey: 'completePages',
            newItemProvider: (concept, context) => {
                const { app, currentModel, ct } = context;
                const existing = currentModel?.filter((item: BaseConceptModel) => item.$concept === concept.name) ?? [];
                return app.createConceptInstance(CompletePage, {
                    name: `${ct(t`completePage`)}${existing.length + 1}`,
                    pageItems: [
                        app.createConceptInstance(TextElement, {
                            content: ct(t`title`),
                        }),
                        app.createConceptInstance(ImageElement, {
                            image: { $type: 'image' },
                        }),
                        app.createConceptInstance(TextElement, {
                            content: ct(t`description`),
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

        /**
         * 自定义CSS
         */
        customCSS: {
            type: 'code',
            name: t`customCSS`,
            language: CodeLanguage.CSS,
            groupKey: 'style',
        },

        generalStyle: {
            type: 'has',
            name: t`text and layout`,
            concept: generalStyle,
            groupKey: 'style',
        },

        questionStyle: {
            type: 'has',
            name: t`question style`,
            concept: QuestionStyle,
            groupKey: 'style',
        },

        answerChoiceStyle: {
            type: 'has',
            name: t`answer choice style`,
            concept: answerChoiceStyle,
            groupKey: 'style',
        },
    },

    import: (data, { app }) => {
        // add $type to data (recursively) if missing
        fixMissingValueTypeForConcept(app.concept, data);

        return { success: true, model: data as any };
    },
});

function fixMissingValueTypeForConcept(concept: Concept, data: any) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.entries(concept.items).forEach(([key, item]) => {
        fixMissingValueTypeForItem(item, data[key]);
    });
}

function fixMissingValueTypeForItem(item: ConfigItem, data: any) {
    if (!data) {
        return;
    }

    switch (item.type) {
        case 'code': {
            fixDataType(data, NonPrimitiveTypes.code);
            break;
        }

        case 'image': {
            fixDataType(data, NonPrimitiveTypes.image);
            break;
        }

        case 'group': {
            fixDataType(data, NonPrimitiveTypes.itemGroup);
            // recurse
            Object.entries(item.items).forEach(([key, subItem]) => fixMissingValueTypeForItem(subItem, data[key]));
            break;
        }

        case 'if': {
            // recurse
            fixMissingValueTypeForItem(item.child, data);
            break;
        }

        case 'has': {
            fixDataType(data, NonPrimitiveTypes.concept);
            // recurse
            fixMissingValueTypeForConcept(item.concept, data);
            break;
        }

        case 'has-many': {
            if (Array.isArray(data)) {
                data.forEach((subData) => {
                    fixDataType(subData, NonPrimitiveTypes.concept);
                    if (typeof subData.$concept === 'string') {
                        // find the concept of the element
                        const subConcept = item.candidates.find((c) => c.name === subData.$concept);
                        if (subConcept) {
                            // recurse
                            fixMissingValueTypeForConcept(subConcept, subData);
                        }
                    }
                });
            }
        }
    }
}

function fixDataType(data: any, type: NonPrimitiveTypes) {
    if (typeof data === 'object' && !data.$type) {
        console.log(`Fixing missing $type to "${type}" in ${JSON.stringify(data)}`);
        data.$type = type;
    }
}
