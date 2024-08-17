import { ConfigGroups, ConfigItem, t } from '@hayadev/configurator';
import { DynamicSelectOption } from '@hayadev/configurator/items';

/**
 * 问题通用配置项
 */
export const QuestionCommonItems = {
    /**
     * 表单项名称
     */
    name: { type: 'text', name: t`itemName`, required: true, groupKey: 'basic' },

    /**
     * 问题
     */
    question: { type: 'text', name: t`question`, groupKey: 'basic' },

    /**
     * 描述信息
     */
    description: {
        type: 'text',
        guarded: true,
        name: t`description1`,
        groupKey: 'basic',
    },

    /**
     * 是否必填
     */
    required: { type: 'switch', name: t`required`, default: false, groupKey: 'basic' },

    /**
     * 是否保存为用户标签
     */
    saveAsUserTag: {
        type: 'dynamic-select',
        guarded: true,
        name: t`saveAsUserTag`,
        multiple: true,
        allowCreate: true,
        groupKey: 'data',

        provider: async () => {
            // TODO: 调用API获取用户标签列表
            return [] as DynamicSelectOption<string>[];
        },
    },
} satisfies Record<string, ConfigItem>;

/**
 * 问题通用分组
 */
export const QuestionCommonGroups = {
    basic: { name: t`basicSettings`, aspect: 'content' },
    answer: { name: t`answer`, aspect: 'content' },
    data: { name: t`data`, aspect: 'content' },
} satisfies ConfigGroups;

export const AlignmentItems = {
    align: {
        type: 'select',
        name: t`alignment`,
        default: 'center',
        options: {
            center: t`centerAlign`,
            left: t`leftAlign`,
            right: t`rightAlign`,
        },
    },
    maxWidth: { type: 'number', name: t`maxWidth%`, default: 100 },
} satisfies Record<string, ConfigItem>;
