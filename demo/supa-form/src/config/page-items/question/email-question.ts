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
    },
});
