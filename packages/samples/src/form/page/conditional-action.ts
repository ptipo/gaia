import {
    ConceptRef,
    ProviderContext,
    createRef,
    defineConcept,
    inferConcept,
    type BaseConceptModel,
} from '@hayadev/configurator';
import { LogicalLeftOperandCandidates, LogicalRightOperandCandidates } from '@hayadev/configurator/items';
import { P, match } from 'ts-pattern';
import { ChoiceQuestion } from '../page-items';
import { ContentPage } from './content-page';
import { GoToPageAction } from './goto-page-action';

/**
 * 条件动作
 */
export const ConditionalAction = defineConcept({
    name: 'ConditionalAction',
    displayName: '条件动作',
    items: {
        /**
         * 条件
         */
        condition: {
            type: 'logical-group',
            name: '当满足以下条件时',
            leftProvider: provideLeftOperand,
            operatorProvider: provideOperator,
            rightProvider: provideRightOperand,
        },

        /**
         * 动作
         */
        action: {
            type: 'if',
            conditionProvider: ({ currentModel }) => !!currentModel.condition,
            child: {
                type: 'has-many',
                name: '动作',
                inline: true,
                help: '当条件为真时执行的动作。',
                candidates: [GoToPageAction],
                minItems: 1,
                maxItems: 1,
            },
        },
    },
});

// 计算左端运算数
function provideLeftOperand({ rootModel }: ProviderContext): LogicalLeftOperandCandidates {
    const items: LogicalLeftOperandCandidates = [];

    (rootModel.contentPages as inferConcept<typeof ContentPage>[]).forEach((page) => {
        // 获得所有问题
        const questions = page.pageItems.filter((item: any) =>
            ['QAQuestion', 'ChoiceQuestion', 'EmailQuestion'].includes(item.$concept)
        );

        // 生成以页面为分组的选项
        items.push(
            ...questions.map((question: any) => {
                return {
                    key: question.$id,
                    label: question.name,
                    value: createRef(question),
                    group: page.name,
                };
            })
        );
    });

    return items;
}

/**
 * 计算运算符
 */
function provideOperator(context: ProviderContext, leftOperandValue: any) {
    const questionRef = leftOperandValue;
    const question = context.app.resolveConcept(questionRef);

    return (
        match(question)
            // 问答/邮件
            .with({ $concept: P.union('QAQuestion', 'EmailQuestion') }, () => [
                { key: 'contains', name: '包含' },
                { key: 'notContains', name: '不包含' },
                { key: 'empty', name: '为空' },
                { key: 'notEmpty', name: '有值' },
            ])
            // 单选
            .with({ $concept: 'ChoiceQuestion', kind: 'single' }, () => [
                { key: 'selected', name: '选择' },
                { key: 'notSelected', name: '未选择' },
                { key: 'empty', name: '为空' },
                { key: 'notEmpty', name: '有值' },
            ])
            // 多选
            .with({ $concept: 'ChoiceQuestion', kind: 'multiple' }, () => [
                { key: 'selectedAll', name: '选择以下全部' },
                { key: 'selectedOne', name: '选择以下任一' },
                { key: 'notSelectedAll', name: '未选择以下全部' },
                { key: 'notSelectedAny', name: '未选择以下任一' },
                { key: 'empty', name: '为空' },
                { key: 'notEmpty', name: '有值' },
            ])
            .otherwise(() => [])
    );
}

// 计算右端运算数
function provideRightOperand(
    context: ProviderContext,
    leftOperandValue: ConceptRef,
    operator: string
): LogicalRightOperandCandidates {
    if (typeof leftOperandValue !== 'object') {
        return { kind: 'none' };
    }

    const questionRef = leftOperandValue;
    let choices: BaseConceptModel[] = [];
    if (questionRef.$concept === 'ChoiceQuestion') {
        const choiceQuestion = context.app.resolveConcept<typeof ChoiceQuestion>(questionRef);
        if (choiceQuestion) {
            choices = choiceQuestion?.textChoices ?? choiceQuestion?.imageChoices ?? [];
        }
    }

    const getChoiceLabel = (choice: BaseConceptModel) => {
        return choice.$concept === 'TextChoice' ? (choice.value as string) : (choice.name as string);
    };

    return match(operator)
        .with(
            P.union('selected', 'notSelected'),
            () =>
                ({
                    kind: 'select',
                    items: choices.map((c) => ({
                        key: c.$id,
                        label: getChoiceLabel(c),
                        value: createRef(c),
                    })),
                } as const)
        )
        .with(
            P.union('selectedAll', 'notSelectedAll', 'notSelectedAny', 'selectedOne'),
            () =>
                ({
                    kind: 'select',
                    multiple: true,
                    items: choices.map((c) => ({
                        key: c.$id,
                        label: getChoiceLabel(c),
                        value: createRef(c),
                    })),
                } as const)
        )
        .with(P.union('contains', 'notContains'), () => ({ kind: 'input' } as const))
        .otherwise(() => ({ kind: 'none' } as const));
}
