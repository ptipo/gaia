import { AppInstance, Concept, defineConcept } from '@hayadev/configurator';
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
            description: 'Show text with image choices. Only valid when the "choiceKind" field is "image".',

            // 仅在图片选项时显示
            condition: { field: 'choiceKind', value: 'image' },

            child: {
                type: 'switch',
                name: '显示选项文字',
                groupKey: 'choice',
                default: true,
            },

            groupKey: 'choice',
        },

        /**
         * 文字选项
         */
        textChoices: {
            type: 'if',
            description: 'Choices for question of "text" kind. Only valid when the "choiceKind" field is "text".',

            // 仅在文字选项时显示
            condition: { field: 'choiceKind', value: 'text' },

            // 条件变化回调，创建默认文字选项
            onConditionChange: ({ app }, value) => (value ? makeDefaultTextChoices(app) : undefined),

            child: {
                type: 'has-many',
                name: '文字选项',
                required: true,
                candidates: [TextChoice],

                // 响应子项内容变化
                onChildChange: (changedItem, currentModel) => {
                    if (changedItem.defaultSelected) {
                        // 清除其他选项的默认选中状态
                        currentModel?.forEach((item) => {
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
            description: 'Choices for question of "image" kind. Only valid when the "choiceKind" field is "image".',

            // 仅在图片选项时显示
            condition: { field: 'choiceKind', value: 'image' },

            // 条件变化回调，创建默认图片选项
            onConditionChange: ({ app }, value) => (value ? makeDefaultImageChoices(app) : undefined),

            child: {
                type: 'has-many',
                name: '图片选项',
                required: true,
                candidates: [ImageChoice],

                // 响应子项内容变化
                onChildChange: (changedItem, currentModel) => {
                    if (changedItem.defaultSelected) {
                        // 清除其他选项的默认选中状态
                        currentModel?.forEach((item) => {
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
            description: 'Limit the number of selected items. Only valid when the "kind" field is "multiple".',

            // 仅在多选时显示
            condition: { field: 'kind', value: 'multiple' },

            child: {
                type: 'dynamic-select',
                name: '限制选项数',

                // 根据当前选项数计算候选项: 1, 2, 3, [总选项数]
                provider: ({ currentModel }) => {
                    const choices =
                        (currentModel?.choiceKind === 'text'
                            ? currentModel?.textChoices
                            : currentModel?.imageChoices) ?? [];
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

    initialize: ({ app }) => ({
        kind: 'single',
        choiceKind: 'text',
        textChoices: makeDefaultTextChoices(app),
    }),

    summary: ({ currentModel }) => {
        return `${currentModel?.name || '选择'} ${currentModel?.required ? '*' : ''}`;
    },

    onModelChange: (model, key, data) => {
        if (model && key === 'choiceKind' && data === 'image') {
            model.flatMode = true;
        }
    },
});

function makeDefaultTextChoices(app: AppInstance<Concept>) {
    return [
        app.createConceptInstance(TextChoice, { value: 'A' }),
        app.createConceptInstance(TextChoice, { value: 'B' }),
        app.createConceptInstance(TextChoice, { value: 'C' }),
        app.createConceptInstance(TextChoice, { value: 'D' }),
    ];
}

function makeDefaultImageChoices(app: AppInstance<Concept>) {
    return [
        app.createConceptInstance(ImageChoice, { name: 'A' }),
        app.createConceptInstance(ImageChoice, { name: 'B' }),
        app.createConceptInstance(ImageChoice, { name: 'C' }),
        app.createConceptInstance(ImageChoice, { name: 'D' }),
    ];
}
