import { defineConcept, t } from '@hayadev/configurator';
import { Font, FontSize, PartialRange } from '../page-items/common';

export const GeneralStyle = defineConcept({
    name: 'GeneralStyle',
    displayName: t`textAndLayout`,
    items: {
        /**
         * 字体
         */
        font: Font,

        /**
         * 字号
         */
        fontSize: FontSize,

        /**
         * 行高
         */
        lineHeight: {
            type: 'select',
            name: t`lineHeight`,
            options: PartialRange,
        },
    },
});
