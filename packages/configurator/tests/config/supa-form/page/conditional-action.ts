import { defineConcept } from '@/concept';
import {
    LogicalOperand,
    LogicalOperandValue,
    LogicalOperator,
    ProviderContext,
} from '@/items';
import { P, match } from 'ts-pattern';

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
            type: 'has-many',
            name: '动作',
            help: '当条件为真时执行的动作。',
            candidates: [],
        },
    },
});

// 计算左端运算数
function provideLeftOperand({ rootModel }: ProviderContext): LogicalOperand {
    const items: {
        label: string;
        value: any;
        group?: string;
    }[] = [];

    rootModel.contentPages.forEach((page: any) => {
        // 获得所有问题
        const questions = page.pageItems.filter((item: any) =>
            ['QAQuestion', 'ChoiceQuestion', 'EmailQuestion'].includes(
                item.$concept.name
            )
        );

        // 生成以页面为分组的选项
        items.push(
            ...questions.map((question: any) => {
                return {
                    label: question.name,
                    value: { page, question },
                    group: page.name,
                };
            })
        );
    });

    return { kind: 'select', items };
}

// 计算右端运算数
function provideRightOperand(
    _context: ProviderContext,
    leftOperandValue: LogicalOperandValue,
    operator: LogicalOperator
): LogicalOperand {
    if (typeof leftOperandValue !== 'object') {
        return { kind: 'none' };
    }

    const { question } = leftOperandValue.value;
    const choices: string[] = question.textChoices ?? question.imageChoices;

    return match(operator.key)
        .with(
            P.union('selected', 'notSelected', 'selectedOne'),
            () =>
                ({
                    kind: 'select',
                    items: choices.map((c) => ({ label: c, value: c })),
                } as const)
        )
        .with(
            P.union('selectedAll', 'notSelectedAll', 'notSelectedAny'),
            () =>
                ({
                    kind: 'select',
                    multiple: true,
                    items: choices.map((c) => ({ label: c, value: c })),
                } as const)
        )
        .with(
            P.union('contains', 'notContains'),
            () => ({ kind: 'input' } as const)
        )
        .otherwise(() => ({ kind: 'none' } as const));
}

/**
 * 计算运算符
 */
function provideOperator(leftOperandValue: LogicalOperandValue) {
    if (typeof leftOperandValue !== 'object') {
        return [];
    }

    return (
        match(leftOperandValue.value.question)
            // 问答/邮件
            .when(
                (q) =>
                    ['QAQuestion', 'EmailQuestion'].includes(q.$concept.name),
                () => [
                    { key: 'contains', name: '包含' },
                    { key: 'notContains', name: '不包含' },
                    { key: 'empty', name: '为空' },
                    { key: 'notEmpty', name: '有值' },
                ]
            )
            // 单选
            .when(
                (q) =>
                    q.$concept.name === 'ChoiceQuestion' && q.kind === 'single',
                () => [
                    { key: 'selected', name: '选择' },
                    { key: 'notSelected', name: '未选择' },
                    { key: 'empty', name: '为空' },
                    { key: 'notEmpty', name: '有值' },
                ]
            )
            // 多选
            .when(
                (q) =>
                    q.$concept.name === 'ChoiceQuestion' &&
                    q.kind === 'multiple',
                () => [
                    { key: 'selectedAll', name: '选择以下全部' },
                    { key: 'selectedOne', name: '选择以下任一' },
                    { key: 'notSelectedAll', name: '未选择以下全部' },
                    { key: 'notSelectedAny', name: '未选择以下任一' },
                    { key: 'empty', name: '为空' },
                    { key: 'notEmpty', name: '有值' },
                ]
            )
            .otherwise(() => [])
    );
}
