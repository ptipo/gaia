import { defineConcept } from '@gaia/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 邮件问题
 */
export const EmailQuestion = defineConcept({
    name: 'EmailQuestion',
    displayName: '邮件',

    groups: QuestionCommonGroups,

    items: {
        ...QuestionCommonItems,
    },
});
