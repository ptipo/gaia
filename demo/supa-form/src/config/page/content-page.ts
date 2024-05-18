import { match } from 'ts-pattern';
import { Concept, defineConcept } from '@gaia/configurator';
import { AllPageItems, ChoiceQuestion } from '../page-items';
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
            candidates: AllPageItems,
            newItemProvider,
        },

        /**
         * 下一步按钮
         */
        nextButton: {
            type: 'has',
            concept: NextButton,
        },
    },

    templates: [
        {
            displayName: '默认表单页',
            model: {
                name: '新页面',
                pageItems: [
                    {
                        $concept: ChoiceQuestion,
                        name: '问题1',
                        question: '问题1',
                        kind: 'single',
                        choiceKind: 'text',
                        textChoices: [
                            { value: 'A', defaultSelected: true },
                            { value: 'B' },
                            { value: 'C' },
                            { value: 'D' },
                        ],
                    },
                ],
            },
        },
    ],
});

// 根据不同的内容项类型，生成默认带自增序号的名称
function newItemProvider(concept: Concept, model: { $concept: Concept }[]) {
    const mappedName = match(concept.name)
        .with('QAQuestion', () => '问答')
        .with('ChoiceQuestion', () => '选择')
        .otherwise(() => undefined);

    if (!mappedName) {
        // 非问题类内容
        return { label: '内容' };
    }

    // 生成带自增序号的问题名称
    return {
        label: `${mappedName}${
            model.filter((item) => item.$concept.name === concept.name).length +
            1
        }`,
    };
}
