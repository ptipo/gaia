import { t } from '@hayadev/configurator';
import { defineGroupItem } from '@hayadev/configurator/items';

/**
 * 自动收集信息设置
 */
export const AutoCollectSetting = defineGroupItem({
    help: t`autoCollectHelp`,

    groups: {
        source: { name: t`sourceInfo`, aspect: 'setting' },
        page: { name: t`pageInfo`, aspect: 'setting' },
    },

    items: {
        /** UTM */
        utmParameters: {
            type: 'switch',
            name: t`utmParams`,
            groupKey: 'source',
        },

        /**
         * 页面URL
         */
        page_url: { type: 'switch', name: t`pageURL`, groupKey: 'page' },

        /**
         * 进入页面URL
         */
        landing_page_url: { type: 'switch', name: t`landingURL`, groupKey: 'page' },
    },
});
