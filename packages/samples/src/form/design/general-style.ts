import { defineConcept, t } from '@hayadev/configurator';

export const GeneralStyle = defineConcept({
    name: 'GeneralStyle',
    displayName: t`textAndLayout`,
    items: {
        /**
         * 字体
         */
        font: {
            type: 'multiple-select',
            name: t`font`,
            options: {
                Arial: 'Arial',
                'Times New Roman': 'Times New Roman',
                'Courier New': 'Courier New',
                'Comic Sans MS': 'Comic Sans MS',
            },
            allowCreate: false,
        },
    },
});
