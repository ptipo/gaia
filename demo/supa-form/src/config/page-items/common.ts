import { ConfigGroups, ConfigItem } from '@hayadev/configurator';
import { DynamicSelectOption } from '@hayadev/configurator/items';

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
    basic: { name: '基本设置', aspect: 'content' },
    answer: { name: '回答', aspect: 'content' },
    data: { name: '数据', aspect: 'content' },
} satisfies ConfigGroups;

export const AlignmentItems = {
    align: {
        type: 'select',
        name: '对齐方式',
        default: 'center',
        options: {
            center: '居中',
            left: '左对齐',
            right: '右对齐',
        },
    },
    maxWidth: { type: 'number', name: '最大宽度%', default: 100 },
} satisfies Record<string, ConfigItem>;

export const Font = {
    type: 'select',
    name: '字体',
    default: 'system',
    options: {
        system: 'system-ui',
        sans: 'Noto Sans JP',
        sans_serif: 'sans-serif',
    },
} satisfies ConfigItem;

export const FontSize = {
    type: 'select',
    name: '字体大小',
    default: 'base',
    options: { xs: '小', sm: '较小', base: '中等', lg: '较大', xl: '大' },
} satisfies ConfigItem;

export const TextCommonItems = {
    fontSize: FontSize,
} satisfies Record<string, ConfigItem>;
