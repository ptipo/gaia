import {
    BaseConceptModel,
    Concept,
    ProviderContext,
    TranslationFunction,
    ValidationIssue,
    ValidationIssueCode,
    cloneConceptModel,
    defineConcept,
    incrementName,
    inferPartialConcept,
    t,
} from '@hayadev/configurator';
import { match } from 'ts-pattern';
import { AllPageItems } from '../page-items';
import { NextButton } from './next-button';

/**
 * 表单页
 */
export const ContentPage = defineConcept({
    name: 'ContentPage',
    displayName: t`contentPage`,
    description: 'Page for collecting user input',

    items: {
        /**
         * 页面名称
         */
        name: { type: 'text', name: t`pageName` },

        /**
         * 页面内容项
         */
        pageItems: {
            type: 'has-many',
            name: t`pageItem`,
            candidates: AllPageItems,
            newItemProvider,
            cloneItemProvider,
        },

        /**
         * 下一步按钮
         */
        nextButton: {
            type: 'has',
            name: t`next`,
            concept: NextButton,
            inline: true,
        },
    },

    selectable: true,

    excludeFromSchema: ['nextButton'],

    validate: (model, ct) => {
        const issues: ValidationIssue[] = [];
        issues.push(...validateDuplicatedQuestionNames(model as inferPartialConcept<typeof ContentPage>, ct));
        return issues;
    },
});

// 根据不同的内容项类型，生成默认带自增序号的名称
function newItemProvider(concept: Concept, context: ProviderContext) {
    const { app, currentModel, ct } = context;

    const mappedName = match(concept.name)
        .with('QAQuestion', () => ct(t`qa`))
        .with('ChoiceQuestion', () => ct(t`choice`))
        .with('EmailQuestion', () => ct(t`email`))
        .with('DateQuestion', () => ct(t`date`))
        .otherwise(() => undefined);

    if (!mappedName) {
        // 非问题类内容
        return app.createConceptInstance(concept, {
            name: ct(concept.displayName),
        });
    }

    // 生成带自增序号的问题名称
    const nameWithSuffix = `${mappedName}${
        (currentModel?.filter((item: BaseConceptModel) => item.$concept === concept.name) ?? []).length + 1
    }`;
    return app.createConceptInstance(concept, {
        name: nameWithSuffix,
        question: nameWithSuffix,
    });
}

function cloneItemProvider(_concept: Concept, source: BaseConceptModel, context: ProviderContext) {
    const result = cloneConceptModel(source);
    const newName = incrementName(
        result.name as string,
        context.currentModel?.map((question: any) => question.name) ?? [],
        { suffix: context.ct(t`clonedCopy`) }
    );
    result.name = newName;
    result.question = newName;
    return result;
}

// 校验问题名称是否重复
function validateDuplicatedQuestionNames(model: inferPartialConcept<typeof ContentPage>, ct: TranslationFunction) {
    const issues: ValidationIssue[] = [];
    const knownQuestionNames = new Set<string>();

    model.pageItems.forEach((item, index) => {
        if (['ChoiceQuestion', 'QAQuestion', 'EmailQuestion', 'DateQuestion'].includes(item.$concept)) {
            if (!item.name || typeof item.name !== 'string') {
                return;
            }
            const name = item.name.trim();
            if (knownQuestionNames.has(name)) {
                issues.push({
                    code: ValidationIssueCode.InvalidValue,
                    message: ct(t`duplicatedQuestionName`) + `: ${name}`,
                    path: ['pageItems', index, 'name'],
                });
            } else {
                knownQuestionNames.add(name);
            }
        }
    });

    return issues;
}
