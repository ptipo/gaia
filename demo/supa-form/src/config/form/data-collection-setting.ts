import { defineGroupItem } from '@gaia/configurator/items';
import { AutoCollectSetting } from './auto-collect-setting';
import { DripSetting } from './drip-setting';

/**
 * 表单信息收集设置
 */
export const DataCollectionSetting = defineGroupItem({
    items: {
        /**
         * 多次填写设置
         */
        drip: DripSetting,

        /**
         * 自动收集信息设置
         */
        autoCollect: AutoCollectSetting,
    },

    groupKey: 'dataCollection',
});
