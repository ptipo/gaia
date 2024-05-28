import { defineConcept } from '@gaia/configurator';
/**
 * 复制到剪贴板元素
 */
export const CopyToClipboard = defineConcept({
    name: 'CopyToClipboard',
    displayName: '复制到剪贴板',

    items: {
        /**
         * 复制内容
         */
        content: {
            type: 'text',
            name: '文本',
            help: '提供用户需要复制使用的内容，例如优惠券码。',
        },
    },
});
