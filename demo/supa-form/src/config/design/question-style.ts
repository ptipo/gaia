import { defineConcept } from '@hayadev/configurator';
import { AlignmentItems, TextCommonItems } from '../page-items/common';
import { defineGroupItem } from '@hayadev/configurator/items';

const sharedItems = {
    ...TextCommonItems,
    align: AlignmentItems.align,
};
const questionGroup = defineGroupItem({
    items: sharedItems,
    groupKey: 'question',
});

const descriptionGroup = defineGroupItem({
    items: sharedItems,
    groupKey: 'description',
});

export const QuestionStyle = defineConcept({
    name: 'QuestionStyle',

    displayName: '问题与描述',

    groups: { question: { name: '问题' }, description: { name: '描述' } },

    items: {
        question: questionGroup,
        description: descriptionGroup,
    },
});
