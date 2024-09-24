import { defineGroupItem } from '@hayadev/configurator/items';
import { getCompletePages } from '../util';
import { t } from '@hayadev/configurator';

/**
 * 多次填写设置
 */
export const DripSetting = defineGroupItem({
    help: t`dripHelp`,

    items: {
        /**
         * 开启
         */
        enable: { type: 'switch', name: t`enableDrip` },

        /**
         * 每次提交控制
         */
        limitPagesPerDrip: {
            type: 'if',
            description: 'Control the number of pages submitted each time. Only valid when the "enable" field is true.',
            condition: { field: 'enable', value: true },
            child: {
                type: 'group',
                items: {
                    /**
                     * 每次最大页数
                     */
                    maxPagesPerDrip: {
                        type: 'number',
                        name: t`maxPagesPerCollect`,
                    },

                    /**
                     * 每次提交后展示页面
                     */
                    dripCompletePage: {
                        type: 'dynamic-select',
                        name: t`pageAfterEachCollect`,

                        // 从root model获取所有页面
                        provider: ({ rootModel }) => getCompletePages(rootModel),
                    },
                },
            },
        },

        /**
         * 信息保留时间
         */
        retention: {
            type: 'select',
            help: t`retentionHelp`,
            name: t`retentionPeriod`,
            options: {
                once: t`oneVisit`,
                oneDay: t`oneDay`,
                oneWeek: t`oneWeek`,
                oneMonth: t`oneMonth`,
                forever: t`forever`,
            },
        },
    },
});
