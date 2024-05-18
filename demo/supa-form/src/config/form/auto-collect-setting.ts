import { defineConcept } from '@gaia/configurator';

/**
 * 自动收集信息设置
 */
export const AutoCollectSetting = defineConcept({
    name: 'AutoCollectSetting',
    displayName: '自动收集信息',

    groups: {
        source: { name: '来源信息', aspect: 'setting' },
        page: { name: '页面信息', aspect: 'setting' },
    },

    items: {
        /** UTM Campaign */
        utmCampaign: {
            type: 'switch',
            name: 'UTM Campaign',
            groupKey: 'source',
        },

        /**
         * UTM Source
         */
        utmSource: { type: 'switch', name: 'UTM Source', groupKey: 'source' },

        /**
         * UTM Medium
         */
        utmMedium: { type: 'switch', name: 'UTM Medium', groupKey: 'source' },

        /**
         * UTM Term
         */
        utmTerm: { type: 'switch', name: 'UTM Term', groupKey: 'source' },

        /**
         * UTM Content
         */
        utmContent: { type: 'switch', name: 'UTM Content', groupKey: 'source' },

        /**
         * 页面URL
         */
        pageUrl: { type: 'switch', name: '页面URL', groupKey: 'page' },

        /**
         * 带参数的页面URL
         */
        pageUrlWithParams: {
            type: 'switch',
            name: '页面URL（包含参数）',
            groupKey: 'page',
        },
    },
});
