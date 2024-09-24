import { defineConcept, t } from '@hayadev/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 问答题
 */
export const QAQuestion = defineConcept({
    name: 'QAQuestion',
    displayName: t`qaQuestion`,

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
            name: t`placeholder`,
            help: t`placeholderHelp`,
            groupKey: 'answer',
        },

        /**
         * 预置内容，自带开关控制开启或关闭
         */
        default: {
            type: 'text',
            guarded: true,
            name: t`prefilledContent`,
            help: t`prefilledContentHelp`,
            groupKey: 'answer',
        },
    },

    summary: ({ currentModel, ct }) => {
        return `${currentModel?.name || ct(t`qa`)} ${currentModel?.required ? '*' : ''}`;
    },
});
