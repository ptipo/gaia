import { ConfigItem, defineConcept, t } from '@hayadev/configurator';
import { defineGroupItem } from '@hayadev/configurator/items';

export const ProgressHeight = {
    type: 'select',
    name: t`progressSize`,
    options: {
        small: t`small`,
        medium: t`medium`,
        large: t`large`,
    },
} satisfies ConfigItem;

const floatingGroup = defineGroupItem({
    items: {
        topBarColor: {
            type: 'color',
            name: t`topBarColor`,
        },
        bottomBarColor: {
            type: 'color',
            name: t`bottomBarColor`,
        },
    },
    groupKey: 'floating',
});

const progressGroup = defineGroupItem({
    items: {
        progressColor: {
            type: 'color',
            name: t`progressColor`,
        },
        progressRemainColor: {
            type: 'color',
            name: t`progressRemainColor`,
        },
        progressHeight: ProgressHeight,
    },
    groupKey: 'progress',
});

export const buttonStyles = {
    buttonSize: {
        type: 'select',
        name: t`buttonSize`,
        options: {
            small: t`small`,
            medium: t`medium`,
            large: t`large`,
        },
    },

    buttonTextColor: {
        type: 'color',
        name: t`buttonTextColor`,
    },
    buttonBackgroundColor: {
        type: 'color',
        name: t`buttonBackgroundColor`,
    },
    buttonBorderColor: {
        type: 'color',
        name: t`buttonBorderColor`,
    },
} satisfies Record<string, ConfigItem>;

const nextButtonGroup = defineGroupItem({
    items: { ...buttonStyles },
    groupKey: 'nextButton',
});

const backButtonGroup = defineGroupItem({
    items: { ...buttonStyles },
    groupKey: 'backButton',
});

export const ProgressButtonStyle = defineConcept({
    name: 'ProgressButton',
    displayName: t`progress and button`,
    groups: {
        floating: { name: t`floating` },
        progress: { name: t`progress` },
        nextButton: { name: t`next button` },
        backButton: { name: t`back button` },
    },
    items: {
        floating: floatingGroup,
        progress: progressGroup,
        nextButton: nextButtonGroup,
        backButton: backButtonGroup,
    },
});
