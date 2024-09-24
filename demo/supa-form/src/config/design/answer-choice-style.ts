import { ConfigItem, defineConcept, t } from '@hayadev/configurator';
import { BackgroundColor, BorderColor, BorderRadius, BorderWidth, Gap, TextCommonItems } from '../page-items/common';
import { defineGroupItem } from '@hayadev/configurator/items';

const answerGroup = defineGroupItem({
    items: {
        ...TextCommonItems,
        backgroundColor: BackgroundColor,
        borderColor: BorderColor,
        placeHolderColor: {
            type: 'color',
            name: t`placeHolderColor`,
        },
        style: {
            type: 'select',
            name: t`style`,
            options: {
                line: t`line`,
                box: t`box`,
            },
        },
        borderWidth: BorderWidth,
        borderRadius: {
            type: 'if',
            name: t`borderRadius`,
            condition: { field: 'style', value: 'box' },
            child: BorderRadius,
        },
    },
    groupKey: 'answer',
});

const choiceGroup = defineGroupItem({
    items: {
        ...TextCommonItems,
        backgroundColor: BackgroundColor,
        borderColor: BorderColor,
        selectIconColor: {
            type: 'color',
            name: t`selectIconColor`,
        },
        borderWidth: BorderWidth,
        borderRadius: BorderRadius,
        gap: Gap,
    },
    groupKey: 'choice',
});

export const AnswerChoiceStyle = defineConcept({
    name: 'AnswerChoiceStyle',
    displayName: t`answerAndChoice`,
    groups: { answer: { name: t`answer` }, choice: { name: t`choice` } },
    items: {
        answer: answerGroup,
        choice: choiceGroup,
    },
});
