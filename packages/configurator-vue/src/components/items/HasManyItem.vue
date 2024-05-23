<script setup lang="ts">
import { confirmDelete } from '@/lib/message';
import {
    createConceptModel,
    type BaseConceptModel,
    type inferConfigItem,
} from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';
import { produce } from 'immer';
import { EnterConceptData } from '../types';

const props = withDefaults(
    defineProps<{
        item: HasManyItem;
        model: inferConfigItem<HasManyItem>;
        /**
         * Whether to display the items inline
         */
        inline?: boolean;
    }>(),
    {
        inline: false,
    }
);

const emit = defineEmits<{
    (e: 'enter', data: EnterConceptData): void;
    (e: 'change', data: inferConfigItem<HasManyItem>): void;
}>();

const onCreate = () => {
    // TODO: deal with multiple candidates
    const concept = props.item.candidates[0];

    const newItem =
        props.item.newItemProvider?.(concept, props.model) ??
        createConceptModel(concept);

    const nextModel = produce(props.model, (draft) => {
        draft.push(newItem);
    });
    emit('change', nextModel);
};

const findConcept = (name: string) => {
    return props.item.candidates.find((c) => c.name === name);
};

const onChangeElement = (data: BaseConceptModel, index: number) => {
    const nextModel = produce(props.model, (draft) => {
        draft[index] = data;
    });
    emit('change', nextModel);
};

const onDeleteElement = async (index: number) => {
    const elementModel = props.model[index];
    if (!elementModel) {
        return;
    }
    const elementConcept = findConcept(elementModel.$concept);
    if (!elementConcept) {
        return;
    }
    if (
        await confirmDelete(
            typeof elementModel.name === 'string' && elementModel.name
                ? elementModel.name
                : elementConcept.displayName
        )
    ) {
        const nextModel = produce(props.model, (draft) => {
            draft.splice(index, 1);
        });
        emit('change', nextModel);
    }
};

const onEnterConcept = (data: EnterConceptData, index: number) => {
    // append key and forward to parent
    console.log('HasMany enter:', data, index);
    emit('enter', { ...data, parentKey: [index, ...data.parentKey] });
};
</script>

<template>
    <div class="flex flex-col">
        <div v-if="!inline" class="text-sm mb-2">{{ item.name }}</div>
        <div class="flex flex-col gap-2">
            <div
                :class="{ 'border rounded p-3': !inline }"
                v-for="(value, index) in model"
            >
                <ConceptElement
                    v-if="findConcept(value.$concept)"
                    :concept="findConcept(value.$concept)"
                    :model="model[index]"
                    :inlineEditing="item.inline"
                    @delete="() => onDeleteElement(index)"
                    @enter="(data: EnterConceptData) => onEnterConcept(data, index)"
                    @change="(data: BaseConceptModel) => onChangeElement(data, index)"
                />
            </div>
        </div>
        <div class="flex flex-col mt-2">
            <el-button link class="self-start" @click="onCreate"
                >+ 添加{{ item.name }}</el-button
            >
        </div>
    </div>
</template>
