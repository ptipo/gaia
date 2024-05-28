import { Concept, createConceptModel, defineConcept } from '@gaia/configurator';
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
        },

        /**
         * 下一步按钮
         */
        nextButton: NextButton,
    },
});

// 根据不同的内容项类型，生成默认带自增序号的名称
function newItemProvider(concept: Concept, model: { $concept: string }[]) {
    const mappedName = match(concept.name)
        .with('QAQuestion', () => '问答')
        .with('ChoiceQuestion', () => '选择')
        .with('EmailQuestion', () => '邮件')
        .otherwise(() => undefined);

    if (!mappedName) {
        // 非问题类内容
        return createConceptModel(concept, { name: concept.displayName });
    }

    // 生成带自增序号的问题名称
    const nameWithSuffix = `${mappedName}${
        model.filter((item) => item.$concept === concept.name).length + 1
    }`;
    return createConceptModel(concept, {
        name: nameWithSuffix,
        question: nameWithSuffix,
    });
}
