import { defineConcept, t } from '@hayadev/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 邮件问题
 */
export const EmailQuestion = defineConcept({
    name: 'EmailQuestion',
    displayName: t`email`,

    groups: QuestionCommonGroups,

    items: {
        ...QuestionCommonItems,
        /**
         * 提示语，自带开关控制开启或关闭
         */ placeholder: {
            type: 'text',
            guarded: true,
            name: t`placeholder`,
            help: t`placeholderHelp`,
            groupKey: 'answer',
        },
    },
});
