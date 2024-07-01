import { defineConcept } from '@hayadev/configurator';
import { QuestionCommonGroups, QuestionCommonItems } from '../common';
import { ImageChoice } from './image-choice';
import { TextChoice } from './text-choice';

/**
 * 选择题
 */
export const ChoiceQuestion = defineConcept({
    name: 'ChoiceQuestion',
    displayName: '选择题',

    groups: { basic: QuestionCommonGroups.basic, choice: { name: '选项' }, data: QuestionCommonGroups.data },

    items: {
        ...QuestionCommonItems,

        /**
         * 类型
         */
        kind: {
            type: 'select',
            name: '类型',
            required: true,
            default: 'single',
            options: { single: '单选', multiple: '多选' },
            groupKey: 'choice',
        },

        /**
         * 选项类型
         */
        choiceKind: {
            type: 'select',
            name: '选项类型',
            required: true,
            default: 'text',
            options: { text: '文字选项', image: '图片选项' },
            groupKey: 'choice',
        },

        /**
         * 显示选项文字
         */
        showTextWithImage: {
            type: 'if',

            // 仅在图片选项时显示
            conditionProvider: ({ currentModel }) => currentModel.choiceKind === 'image',

            child: {
                type: 'switch',
                name: '显示选项文字',
                groupKey: 'choice',
            },

            groupKey: 'choice',
        },

        /**
         * 文字选项
         */
        textChoices: {
            type: 'if',

            // 仅在文字选项时显示
            conditionProvider: ({ currentModel }) => currentModel.choiceKind === 'text',

            child: {
                type: 'has-many',
                name: '文字选项',
                required: true,
                candidates: [TextChoice],

                // 响应子项内容变化
                onChildChange: (changedItem, currentModel) => {
                    if (changedItem.defaultSelected) {
                        // 清除其他选项的默认选中状态
                        currentModel.forEach((item) => {
                            if (item !== changedItem) {
                                item.defaultSelected = false;
                            }
                        });
                    }
                },
            },

            groupKey: 'choice',
        },

        /**
         * 图片选项
         */
        imageChoices: {
            type: 'if',

            // 仅在图片选项时显示
            conditionProvider: ({ currentModel }) => currentModel.choiceKind === 'image',

            child: {
                type: 'has-many',
                name: '图片选项',
                required: true,
                candidates: [ImageChoice],

                // 响应子项内容变化
                onChildChange: (changedItem, currentModel) => {
                    if (changedItem.defaultSelected) {
                        // 清除其他选项的默认选中状态
                        currentModel.forEach((item) => {
                            if (item !== changedItem) {
                                item.defaultSelected = false;
                            }
                        });
                    }
                },
            },
            groupKey: 'choice',
        },

        /**
         * 限制选项数
         */
        limitSelectedItems: {
            type: 'if',

            // 仅在多选时显示
            conditionProvider: ({ currentModel }) => currentModel.kind === 'multiple',

            child: {
                type: 'dynamic-select',
                name: '限制选项数',

                // 根据当前选项数计算候选项: 1, 2, 3, [总选项数]
                provider: ({ currentModel }) => {
                    const choices =
                        (currentModel.choiceKind === 'text' ? currentModel.textChoices : currentModel.imageChoices) ??
                        [];
                    return Array.from(new Array(choices.length), (_, i) => ({
                        key: i + 1,
                        label: (i + 1).toString(),
                        value: i + 1,
                    }));
                },
            },
            groupKey: 'choice',
        },

        /**
         * 随机顺序
         */
        randomOrder: {
            type: 'switch',
            name: '随机顺序',
            groupKey: 'choice',
        },

        /**
         * 平铺选项
         */
        flatMode: {
            type: 'switch',
            name: '平铺选项',
            groupKey: 'choice',
        },
    },

    summary: ({ currentModel }) => {
        return `${currentModel.name || '选择'} ${currentModel.required ? '*' : ''}`;
    },
});
