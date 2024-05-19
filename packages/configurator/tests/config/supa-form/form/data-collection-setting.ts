import { defineConcept } from '@/concept';
import { AutoCollectSetting } from './auto-collect-setting';
import { DripSetting } from './drip-setting';

/**
 * 表单信息收集设置
 */
export const DataCollectionSetting = defineConcept({
    name: 'DataCollectionSetting',
    displayName: '表单信息收集',

    items: {
        /**
         * 多次填写设置
         */
        drip: {
            type: 'has',
            concept: DripSetting,
            help: '当用户未能完成表单，自动记录表单填写进度，在下次展示时从未完成的问题开始。',
        },

        /**
         * 自动收集信息设置
         */
        autoCollect: {
            type: 'has',
            concept: AutoCollectSetting,
            help: '除了表单中需要填写的内容，自动收录其它信息。',
        },
    },
});
