import { defineConcept, t } from '@hayadev/configurator';
import { AlignmentItems } from '../common';
/**
 * 复制到剪贴板元素
 */
export const CopyToClipboard = defineConcept({
    name: 'CopyToClipboard',
    displayName: t`copyToClipboard`,

    items: {
        /**
         * 复制内容
         */
        content: {
            type: 'text',
            name: t`text`,
            help: t`copyToClipboardHelp`,
        },
        ...AlignmentItems,
    },
});
