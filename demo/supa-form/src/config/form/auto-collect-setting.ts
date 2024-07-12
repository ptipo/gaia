import { defineGroupItem } from '@hayadev/configurator/items';

/**
 * 自动收集信息设置
 */
export const AutoCollectSetting = defineGroupItem({
    help: '除了表单中需要填写的内容，自动收录其它信息。',

    groups: {
        source: { name: '来源信息', aspect: 'setting' },
        page: { name: '页面信息', aspect: 'setting' },
    },

    items: {
        /** UTM */
        utmParameters: {
            type: 'switch',
            name: 'UTM Parameters',
            groupKey: 'source',
        },

        /**
         * 页面URL
         */
        page_url: { type: 'switch', name: '页面URL', groupKey: 'page' },

        /**
         * 进入页面URL
         */
        landing_page_url: { type: 'switch', name: '进入页面URL', groupKey: 'page' },
    },
});
