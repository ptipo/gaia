import {
    type BaseConceptModel,
    Concept,
    ConfigItem,
    defineConcept,
    t,
    NonPrimitiveTypes,
    AppInstance,
} from '@hayadev/configurator';
import { ChoiceQuestion, ImageElement, TextElement } from '../page-items';
import { CompletePage } from '../page/complete-page';
import { ContentPage } from '../page/content-page';
import { DataCollectionSetting } from './data-collection-setting';
import { LanguageSetting } from './language-setting';
import { QuestionStyle } from '../design/question-style';
import { generalStyle } from '../design/general-style';
import { answerChoiceStyle as AnswerChoiceStyle } from '../design/answer-choice-style';
import { ProgressButtonStyle } from '../design/progress-button-style';
import { BackgroundStyle } from '../design/background-style';
import { LayoutStyle } from '../design/layout-style';
import { CustomCSS } from '../design/custom-css';

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
        customStyle: {
            type: 'has',
            name: t`customCSS`,
            concept: CustomCSS,
            groupKey: 'style',
        },

        generalStyle: {
            type: 'has',
            name: t`textAndLayout`,
            concept: generalStyle,
            groupKey: 'style',
        },

        questionStyle: {
            type: 'has',
            name: t`questionStyle`,
            concept: QuestionStyle,
            groupKey: 'style',
        },

        answerChoiceStyle: {
            type: 'has',
            name: t`answerChoiceStyle`,
            concept: AnswerChoiceStyle,
            groupKey: 'style',
        },

        progressButtonStyle: {
            type: 'has',
            name: t`progressButtonStyle`,
            concept: ProgressButtonStyle,
            groupKey: 'style',
        },
        backgroundStyle: {
            type: 'has',
            name: t`backgroundStyle`,
            concept: BackgroundStyle,
            groupKey: 'style',
        },
        LayoutStyle: {
            type: 'has',
            name: t`layoutStyle`,
            concept: LayoutStyle,
            groupKey: 'style',
        },
    },

    import: (data, { app }) => {
        // add $type to data (recursively) if missing
        fixMissingValueTypeForConcept(app.concept, data);

        fixCustomCSS(app, data);

        fixFont(data);

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

//change customCSS from top-level item of Form to a nested item of customStyle
function fixCustomCSS(app: AppInstance<Concept<Record<string, ConfigItem>>>, data: any) {
    const customCss = data.customCSS;
    if (customCss) {
        console.log('Fixing customCSS');
        const customCSSConcept = app.createConceptInstance(CustomCSS, {
            customCSS: data.customCSS,
        });
        data.customStyle = customCSSConcept;
        data.customCSS = undefined;
    }
}

function fixFont(data: any) {
    const generalStyle = data.generalStyle;
    if (generalStyle) {
        const font = generalStyle.font;
        // if font is single string, make it a array of string
        if (typeof font === 'string') {
            console.log('Fixing font');
            generalStyle.font = [font];
        }
    }
}
