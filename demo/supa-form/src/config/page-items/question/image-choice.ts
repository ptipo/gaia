import { defineConcept } from '@hayadev/configurator';
/**
 * 图片选项
 */
export const ImageChoice = defineConcept({
    name: 'ImageChoice',
    displayName: '图片选项',

    items: {
        value: {
            type: 'text',
            name: '选项',
            required: true,
        },

        /**
         * 内容
         */
        image: {
            type: 'image',
            name: '图片',
            default: 'https://comp.ptengine.com/res/placeholder-md.svg',
            required: true,
        },

        /**
         * 默认选中
         */
        defaultSelected: {
            type: 'switch',
            name: '默认选中',
        },
    },

    summary: ({ currentModel }) => currentModel.value as string,
});
