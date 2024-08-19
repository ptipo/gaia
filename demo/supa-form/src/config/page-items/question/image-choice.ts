import { defineConcept, t } from '@hayadev/configurator';
/**
 * 图片选项
 */
export const ImageChoice = defineConcept({
    name: 'ImageChoice',
    displayName: t`imageOption`,

    items: {
        name: {
            type: 'text',
            name: t`choiceOption`,
            required: true,
        },

        /**
         * 内容
         */
        value: {
            type: 'image',
            name: t`image`,
            default: 'https://comp.ptengine.com/res/placeholder-md.svg',
            required: true,
        },

        /**
         * 默认选中
         */
        defaultSelected: {
            type: 'switch',
            name: t`defaultSelected`,
        },
    },

    summary: ({ currentModel }) => (currentModel?.name as string) ?? '',
});
