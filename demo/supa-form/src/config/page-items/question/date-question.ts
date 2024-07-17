import { defineConcept } from '@hayadev/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';

/**
 * 日期题
 */
export const DateQuestion = defineConcept({
    name: 'DateQuestion',
    displayName: '日期',

    groups: {
        ...QuestionCommonGroups,
    },

    items: {
        ...QuestionCommonItems,

        format: {
            type: 'select',
            name: '格式',
            default: 'mmddyyyy',
            options: {
                mmddyyyy: 'MM/DD/YYYY',
                ddmmyyyy: 'DD/MM/YYYY',
                yyyymmdd: 'YYYY/MM/DD',
            },
            groupKey: 'basic',
        },
    },

    summary: ({ currentModel }) => {
        return `${currentModel.name || '日期'} ${currentModel.required ? '*' : ''}`;
    },
});
