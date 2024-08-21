import { defineConcept, t } from '@hayadev/configurator';
import { Font, FontSize } from '../page-items/common';

export const generalStyle = defineConcept({
    name: 'generalStyle',
    displayName: t`text and layout`,
    items: {
        /**
         * 字体
         */
        font: Font,

        /**
         * 字号
         */
        fontSize: FontSize,
    },
});
