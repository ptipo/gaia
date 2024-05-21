import { defineGroupItem } from '@gaia/configurator/items';
import { getAllPages } from '../util';

/**
 * 多次填写设置
 */
export const DripSetting = defineGroupItem({
    help: '当用户未能完成表单，自动记录表单填写进度，在下次展示时从未完成的问题开始。',

    items: {
        /**
         * 开启
         */
        enable: { type: 'switch', name: '开启' },

        /**
         * 每次提交控制
         */
        limitPagesPerDrip: {
            type: 'if',
            condition: ({ currentModel }) => currentModel.enable,
            child: {
                type: 'group',

                items: {
                    /**
                     * 每次最大页数
                     */
                    maxPagesPerDrip: {
                        type: 'number',
                        name: '每次最大页数',
                    },

                    /**
                     * 每次提交后展示页面
                     */
                    dripCompletePage: {
                        type: 'dynamic-select',
                        name: '每次提交后展示页面',

                        // 从root model获取所有页面
                        provider: ({ rootModel }) => getAllPages(rootModel),
                    },

                    /**
                     * 最终提交后展示页面
                     */
                    formCompletePage: {
                        type: 'dynamic-select',
                        name: '最终提交后展示页面',

                        // 从root model获取所有页面
                        provider: ({ rootModel }) => getAllPages(rootModel),
                    },
                },
            },
        },

        /**
         * 信息保留时间
         */
        retention: {
            type: 'select',
            help: '超过信息保留时间后，用户将需要重新填写表单',
            options: {
                once: '1次访问',
                oneDay: '1天',
                oneWeek: '1周',
                oneMonth: '1个月',
                forever: '永久（直到用户身份失效）',
            },
        },
    },
});
