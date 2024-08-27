import { defineConcept, t } from '@hayadev/configurator';
import { BackgroundColor, BorderColor, Gap, TextCommonItems } from '../page-items/common';
import { defineGroupItem } from '@hayadev/configurator/items';

const answerGroup = defineGroupItem({
    items: {
        ...TextCommonItems,
        BackgroundColor,
        BorderColor,
        placeHolderColor: {
            type: 'color',
            name: t`placeHolderColor`,
        },
    },
    groupKey: 'answer',
});

const choiceGroup = defineGroupItem({
    items: {
        ...TextCommonItems,
        BackgroundColor,
        BorderColor,
        Gap,
    },
    groupKey: 'choice',
});

export const answerChoiceStyle = defineConcept({
    name: 'answerChoiceStyle',
    displayName: t`answerAndChoice`,
    groups: { answer: { name: t`answer` }, choice: { name: t`choice` } },
    items: {
        answer: answerGroup,
        choice: choiceGroup,
    },
});
