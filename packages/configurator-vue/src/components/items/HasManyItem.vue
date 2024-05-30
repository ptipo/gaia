<script setup lang="ts">
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { confirmDelete } from '@/lib/message';
import {
    AppInstance,
    Concept,
    type BaseConceptModel,
    type inferConfigItem,
} from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';
import { inject, type Ref } from 'vue';
import type { EnterConceptData } from '../types';

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

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const onCreate = (concept: Concept) => {
    const currentItemCount = props.model.length;
    const context = {
        app: app!,
        currentModel: props.model,
        rootModel: rootModel?.value,
    };
    const newItem =
        props.item.newItemProvider?.(concept, context) ??
        app!.createConceptInstance(concept);

    const nextModel = [...props.model, newItem];
    emit('change', nextModel);

    if (!props.item.inline) {
        onEnterConcept(
            { concept, model: newItem, parentKey: [] },
            currentItemCount
        );
    }
};

const findConcept = (name: string) => {
    return props.item.candidates.find((c) => c.name === name);
};

const onChangeElement = (data: BaseConceptModel, index: number) => {
    const nextModel = [...props.model];
    nextModel[index] = data;
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
        const nextModel = [
            ...props.model.slice(0, index),
            ...props.model.slice(index + 1),
        ];
        emit('change', nextModel);
    }
};

const onEnterConcept = (data: EnterConceptData, index: number) => {
    // append key and forward to parent
    emit('enter', { ...data, parentKey: [index, ...data.parentKey] });
};
</script>

<template>
    <div class="flex flex-col">
        <div v-if="!inline" class="mb-2">{{ item.name }}</div>
        <div class="flex flex-col gap-2">
            <div
                :class="{ 'border rounded p-3': !inline }"
                v-for="(value, index) in model"
            >
                <ConceptElement
                    v-if="findConcept(value.$concept)"
                    :concept="findConcept(value.$concept)"
                    :key="model[index].$id"
                    :model="model[index]"
                    :inlineEditing="item.inline"
                    @delete="() => onDeleteElement(index)"
                    @enter="(data: EnterConceptData) => onEnterConcept(data, index)"
                    @change="(data: BaseConceptModel) => onChangeElement(data, index)"
                />
            </div>
        </div>
        <div class="flex flex-col mt-2">
            <el-button
                v-if="item.candidates.length === 1"
                link
                class="self-start"
                @click="() => onCreate(item.candidates[0])"
                >+ 添加{{ item.name }}</el-button
            >
            <el-dropdown v-else>
                <el-button link class="self-start"
                    >+ 添加{{ item.name }}</el-button
                >
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-for="candidate in item.candidates"
                            @click="() => onCreate(candidate)"
                            >{{ candidate.displayName }}</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
