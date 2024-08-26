import { defineConcept, t } from '@hayadev/configurator';

export const BackgroundStyle = defineConcept({
    name: 'BackgroundStyle',
    displayName: 'background ',
    items: {
        background: {
            type: 'select',
            name: t`background`,
            options: {
                transparent: t`transparent`,
                color: t`color`,
                image: t`image`,
            },
        },
        backgroundColor: {
            type: 'if',
            name: t`background color`,
            condition: { field: 'background', value: 'color' },
            child: {
                type: 'color',
                name: t`backgroundColor`,
            },
        },
        backgroundImage: {
            type: 'if',
            name: t`background image`,
            condition: { field: 'background', value: 'image' },
            child: {
                type: 'image',
                name: t`backgroundImage`,
            },
        },
        backgroundImageFill: {
            type: 'if',
            name: t`background image fill`,
            condition: { field: 'background', value: 'image' },
            child: {
                type: 'select',
                name: t`background image fill`,
                options: {
                    contain: t`contain`,
                    cover: t`cover`,
                },
            },
        },
    },
});
