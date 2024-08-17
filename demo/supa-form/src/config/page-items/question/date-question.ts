import { defineConcept, t } from '@hayadev/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 日期题
 */
export const DateQuestion = defineConcept({
    name: 'DateQuestion',
    displayName: t`date`,

    groups: {
        ...QuestionCommonGroups,
    },

    items: {
        ...QuestionCommonItems,

        format: {
            type: 'select',
            name: t`format`,
            default: 'mmddyyyy',
            options: {
                mmddyyyy: 'MM/DD/YYYY',
                ddmmyyyy: 'DD/MM/YYYY',
                yyyymmdd: 'YYYY/MM/DD',
            },
            groupKey: 'basic',
        },
    },

    summary: ({ currentModel, ct }) => {
        return `${currentModel?.name || ct(t`date`)} ${currentModel?.required ? '*' : ''}`;
    },
});
