import { ConfigGroups } from '@hayadev/configurator';
import { ConfigItem } from '@hayadev/configurator';

/**
 * 问题通用配置项
 */
export const QuestionCommonItems = {
    /**
     * 表单项名称
     */
    name: { type: 'text', name: '表单项名称', required: true, groupKey: 'basic' },

    /**
     * 问题
     */
    question: { type: 'text', name: '问题', groupKey: 'basic' },

    /**
     * 描述信息
     */
    description: {
        type: 'text',
        guarded: true,
        name: '描述',
        groupKey: 'basic',
    },

    /**
     * 是否必填
     */
    required: { type: 'switch', name: '必填', default: false, groupKey: 'basic' },

    /**
     * 是否保存为用户标签
     */
    saveAsUserTag: {
        type: 'dynamic-select',
        guarded: true,
        name: '保存为用户标签',
        groupKey: 'data',

        provider: async () => {
            // TODO: 调用API获取用户标签列表
            return [
                {
                    key: 'tag1',
                    label: '标签1',
                    value: '标签1',
                },
                {
                    key: 'tag2',
                    label: '标签2',
                    value: '标签2',
                },
                {
                    key: 'tag3',
                    label: '标签3',
                    value: '标签3',
                },
            ];
        },
    },
} satisfies Record<string, ConfigItem>;

/**
 * 问题通用分组
 */
export const QuestionCommonGroups = {
    basic: { name: '基本设置', aspect: 'content' },
    answer: { name: '回答', aspect: 'content' },
    data: { name: '数据', aspect: 'content' },
} satisfies ConfigGroups;
