import { defineConcept } from '@/concept';
/**
 * 图片选项
 */
export const ImageChoice = defineConcept({
    name: 'ImageChoice',
    displayName: '图片选项',

    items: {
        name: {
            type: 'text',
            required: true,
        },

        /**
         * 内容
         */
        value: {
            type: 'image',
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
});
