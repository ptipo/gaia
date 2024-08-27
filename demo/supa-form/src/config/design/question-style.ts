import { defineConcept, t } from '@hayadev/configurator';
import { BackgroundColor, getAlignConfig, TextCommonItems } from '../page-items/common';
import { defineGroupItem } from '@hayadev/configurator/items';

const sharedItems = {
    ...TextCommonItems,
    ...getAlignConfig(),
};
const questionGroup = defineGroupItem({
    items: { BackgroundColor, ...sharedItems },
    groupKey: 'question',
});

export const descriptionGroup = defineGroupItem({
    items: sharedItems,
    groupKey: 'description',
});

export const QuestionStyle = defineConcept({
    name: 'QuestionStyle',

    displayName: t`questionAndDescription`,

    groups: { question: { name: t`question` }, description: { name: t`description` } },

    items: {
        question: questionGroup,
        description: descriptionGroup,
    },
});
