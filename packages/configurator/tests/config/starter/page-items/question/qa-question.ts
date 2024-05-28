import { defineConcept } from '@gaia/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 问答题
 */
export const QAQuestion = defineConcept({
    name: 'QAQuestion',
    displayName: '问答题',

    groups: {
        ...QuestionCommonGroups,
    },

    items: {
        ...QuestionCommonItems,

        /**
         * 提示语，自带开关控制开启或关闭
         */
        placeholder: {
            type: 'text',
            guarded: true,
            name: '提示语（Placeholder）',
            help: 'Placeholder，帮助用户简单理解操作要求或呼吁用户行动',
            groupKey: 'answer',
        },

        /**
         * 预置内容，自带开关控制开启或关闭
         */
        default: {
            type: 'text',
            guarded: true,
            name: '预置内容',
            help: '在用户未填写的情况下预置部分内容，常用于提供填写格式模板',
            groupKey: 'answer',
        },
    },

    summary: (model) => {
        return `${model.name || '问答'} ${model.required ? '*' : ''}`;
    },
});
