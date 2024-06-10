<script setup lang="ts">
import { APP_KEY, CURRENT_SELECTION, ROOT_MODEL_KEY } from '@/lib/constants';
import { confirmDelete } from '@/lib/message';
import { AppInstance, Concept, type BaseConceptModel } from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';
import { createId } from '@paralleldrive/cuid2';
import deepcopy from 'deepcopy';
import { inject, ref, watch, type Ref } from 'vue';
import draggable from 'vuedraggable';
import type { ConceptModelPair, EnterConceptData, SelectionData } from '../types';
import type { CommonEvents, CommonProps } from './common';

const props = withDefaults(
    defineProps<
        CommonProps<HasManyItem> & {
            /**
             * Whether to display the items inline
             */
            inline?: boolean;
        }
    >(),
    {
        inline: false,
    }
);

const emit = defineEmits<
    CommonEvents<HasManyItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);
const currentSelection = inject<Ref<SelectionData>>(CURRENT_SELECTION);

// mutable state for draggable
const draggableState = ref(props.model);

// draggable drag end
const onDragEnd = () => {
    emit('change', draggableState.value);
};

// sync prop's model change to draggableState
watch(
    () => props.model,
    (newValue) => {
        draggableState.value = newValue;
    }
);

const onCreate = (candidate: Concept) => {
    const newItem = createItem(candidate);
    const currentItemCount = props.model.length;
    const nextModel = [...props.model, newItem];
    emit('change', nextModel);

    if (!props.item.inline) {
        onEnterConcept({ concept: candidate, model: newItem, path: [] }, currentItemCount);
    }
};

const createItem = (concept: Concept) => {
    const context = {
        app: app!,
        currentModel: props.model,
        rootModel: rootModel?.value,
    };
    return props.item.newItemProvider?.(concept, context) ?? app!.createConceptInstance(concept);
};

const findConcept = (name: string) => {
    return props.item.candidates.find((c) => c.name === name);
};

const onChangeElement = (data: BaseConceptModel, index: number) => {
    const nextModel = [...props.model];
    nextModel[index] = data;
    emit('change', nextModel);
};

const onAddSibling = (index: number) => {
    const model = props.model[index];
    if (!model) {
        return;
    }

    const concept = findConcept(model.$concept);
    if (!concept) {
        return;
    }

    const newItem = createItem(concept);
    const nextModel = [...props.model.slice(0, index + 1), newItem, ...props.model.slice(index + 1)];
    emit('change', nextModel);
};

const onCloneElement = (index: number) => {
    const elementModel = props.model[index];
    if (!elementModel) {
        return;
    }

    const cloned = deepcopy(elementModel);
    cloned.$id = createId();
    const nextModel = [...props.model, cloned];
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
            typeof elementModel.name === 'string' && elementModel.name ? elementModel.name : elementConcept.displayName
        )
    ) {
        const nextModel = [...props.model.slice(0, index), ...props.model.slice(index + 1)];
        emit('change', nextModel);
    }
};

const onEnterConcept = (data: EnterConceptData, index: number) => {
    // append key and forward to parent
    emit('enter', { ...data, path: [index, ...data.path] });
};

const onElementSelected = ({ model, concept }: ConceptModelPair) => {
    emit('selectionChange', { concept, id: model.$id });
};

const isSelected = (element: BaseConceptModel) => {
    return currentSelection?.value?.concept.name === element.$concept && currentSelection?.value?.id === element.$id;
};
</script>

<template>
    <div class="flex flex-col">
        <div v-if="!inline" class="mb-2">{{ item.name }}</div>

        <!-- draggable element list -->
        <draggable class="flex flex-col gap-2" v-model="draggableState" item-key="$id" @end="onDragEnd">
            <template #item="{ element, index }">
                <div
                    :class="{ 'border rounded p-3': !inline, 'border-blue-600': isSelected(element) }"
                    class="flex items-center w-full"
                >
                    <div class="flex-grow">
                        <ConceptElement
                            v-if="findConcept(element.$concept)"
                            :concept="findConcept(element.$concept)"
                            :key="element.$id"
                            :model="element"
                            :inlineEditing="item.inline"
                            :allowDelete="props.model.length > 1"
                            @addSibling="() => onAddSibling(index)"
                            @clone="() => onCloneElement(index)"
                            @delete="() => onDeleteElement(index)"
                            @enter="(data: EnterConceptData) => onEnterConcept(data, index)"
                            @change="(data: BaseConceptModel) => onChangeElement(data, index)"
                            @selected="(data: ConceptModelPair) => onElementSelected(data)"
                        />
                    </div>
                </div>
            </template>
        </draggable>

        <!-- footer button -->
        <div class="flex flex-col mt-2">
            <el-button
                v-if="item.candidates.length === 1"
                link
                type="info"
                class="self-start"
                @click="() => onCreate(item.candidates[0])"
                >+ 添加{{ item.name }}</el-button
            >
            <el-dropdown v-else>
                <el-button link type="info" class="self-start">+ 添加{{ item.name }}</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="candidate in item.candidates" @click="() => onCreate(candidate)">{{
                            candidate.displayName
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
