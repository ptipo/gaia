import { defineConcept, t } from '@hayadev/configurator';
import { getAlignConfig, TextCommonItems } from '../page-items/common';
import { defineGroupItem } from '@hayadev/configurator/items';

const sharedItems = {
    ...TextCommonItems,
    ...getAlignConfig(),
};
const questionGroup = defineGroupItem({
    items: sharedItems,
    groupKey: 'question',
});

export const descriptionGroup = defineGroupItem({
    items: sharedItems,
    groupKey: 'description',
});

export const QuestionStyle = defineConcept({
    name: 'QuestionStyle',

    displayName: t`question and description`,

    groups: { question: { name: t`问题` }, description: { name: t`描述` } },

    items: {
        question: questionGroup,
        description: descriptionGroup,
    },
});
