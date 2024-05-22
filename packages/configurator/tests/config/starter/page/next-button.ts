import { defineGroupItem } from '@gaia/configurator/items';
import { getAllPages } from '../util';
import { ConditionalAction } from './conditional-action';

/**
 * 下一步按钮
 */
export const NextButton = defineGroupItem({
    groups: { basic: { name: '基本设置' }, action: { name: '动作设置' } },

    items: {
        /**
         * 动作
         */
        action: {
            type: 'select',
            name: '点击按钮时',
            default: 'next',
            options: {
                next: '前往下一页',
                goToPage: '前往指定页面',
                conditional: '根据回答，执行不同动作',
            },
            groupKey: 'action',
        },

        /**
         * 跳转目标页面
         */
        targetPage: {
            type: 'if',

            // 仅在动作为“前往指定页面”时显示
            condition: ({ currentModel }) => currentModel.action === 'goToPage',

            child: {
                type: 'dynamic-select',
                name: '前往页面',

                // 从root model获取所有页面
                provider: ({ rootModel }) => getAllPages(rootModel),
            },
            groupKey: 'action',
        },

        /**
         * 条件动作
         */
        conditionalAction: {
            type: 'if',

            // 仅在动作为“根据回答，执行不同动作”时显示
            condition: ({ currentModel }) =>
                currentModel.action === 'conditional',

            child: ConditionalAction,

            groupKey: 'action',
        },
    },
});
