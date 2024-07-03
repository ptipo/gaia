import { BaseConceptModel, Concept, ProviderContext, defineConcept, incrementName } from '@hayadev/configurator';
import deepcopy from 'deepcopy';
import { match } from 'ts-pattern';
import { AllPageItems } from '../page-items';
import { NextButton } from './next-button';

/**
 * 表单页
 */
export const ContentPage = defineConcept({
    name: 'ContentPage',
    displayName: '表单页',

    items: {
        /**
         * 页面名称
         */
        name: { type: 'text', name: '页面名称' },

        /**
         * 页面内容项
         */
        pageItems: {
            type: 'has-many',
            name: '内容项',
            candidates: AllPageItems,
            newItemProvider,
            cloneItemProvider,
        },

        /**
         * 下一步按钮
         */
        nextButton: {
            type: 'has',
            name: '下一步',
            concept: NextButton,
            inline: true,
        },
    },

    selectable: true,
});

// 根据不同的内容项类型，生成默认带自增序号的名称
function newItemProvider(concept: Concept, context: ProviderContext) {
    const { app, currentModel } = context;

    const mappedName = match(concept.name)
        .with('QAQuestion', () => '问答')
        .with('ChoiceQuestion', () => '选择')
        .with('EmailQuestion', () => '邮件')
        .otherwise(() => undefined);

    if (!mappedName) {
        // 非问题类内容
        return app.createConceptInstance(concept, {
            name: concept.displayName,
        });
    }

    // 生成带自增序号的问题名称
    const nameWithSuffix = `${mappedName}${
        currentModel.filter((item: BaseConceptModel) => item.$concept === concept.name).length + 1
    }`;
    return app.createConceptInstance(concept, {
        name: nameWithSuffix,
        question: nameWithSuffix,
    });
}

function cloneItemProvider(_concept: Concept, source: BaseConceptModel, context: ProviderContext) {
    const result = deepcopy(source);
    const newName = incrementName(
        result.name as string,
        context.currentModel.map((question: any) => question.name),
        { suffix: '副本' }
    );
    result.name = newName;
    result.question = newName;
    return result;
}
