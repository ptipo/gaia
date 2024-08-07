<script setup lang="ts">
import { APP_KEY, CURRENT_SELECTION_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { confirmDelete } from '@/lib/message';
import {
    cloneConceptModel,
    incrementName,
    type SelectionData,
    type AppInstance,
    type BaseConceptModel,
    type Concept,
} from '@hayadev/configurator';
import type { HasManyItem } from '@hayadev/configurator/items';
import { v4 as uuid } from 'uuid';
import { computed, inject, ref, watch, type Ref } from 'vue';
import draggable from 'vuedraggable';
import type { ConceptModelPair, EnterConceptData } from '../types';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';

const props = withDefaults(
    defineProps<
        CommonProps<HasManyItem> & {
            /**
             * Whether to display the items inline
             */
            inline?: boolean;

            /**
             * Whether to show the create button
             */
            showCreateButton?: boolean;
        }
    >(),
    {
        inline: false,
        showCreateButton: true,
    }
);

const emit = defineEmits<
    CommonEvents<HasManyItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();

// mutable model
const _model = ref<BaseConceptModel[]>([...(props.model ?? [])]);

// for identifying the concept element inside the draggable component
const thisInstanceId = uuid();

// track props changes
watch(
    () => props.model,
    (value) => {
        _model.value = [...(value ?? [])];
    }
);

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);
const currentSelection = inject<Ref<SelectionData>>(CURRENT_SELECTION_KEY);

// draggable state changed
const onDragChanged = () => {
    emitChange();
};

// compute a stable draggable group key to ensure items can only be dragged among
// compatible containers
const draggableGroup = computed(() => {
    return props.item.candidates
        .map((c) => c.name)
        .sort()
        .join('-');
});

const onCreate = (candidate: Concept) => {
    const newItem = createItem(candidate);
    _model.value.push(newItem);
    emitChange();

    if (!props.item.inline) {
        onEnterConcept({ concept: candidate, model: newItem, path: [] }, _model.value.length - 1);
    }

    emit('selectionChange', { concept: candidate, id: newItem.$id });
};

const createItem = (concept: Concept) => {
    const context = {
        app: app!,
        currentModel: _model.value,
        rootModel: rootModel?.value,
    };
    return props.item.newItemProvider?.(concept, context) ?? app!.createConceptInstance(concept);
};

const findConcept = (name: string) => {
    return props.item.candidates.find((c) => c.name === name);
};

const onChangeElement = (data: BaseConceptModel, index: number) => {
    _model.value[index] = data;

    // call the onChildChange hook
    props.item.onChildChange?.(data, _model.value);

    emitChange();
};

const onAddSibling = (index: number, { concept }: ConceptModelPair) => {
    const newItem = createItem(concept);
    _model.value.splice(index + 1, 0, newItem);
    emitChange();
};

const onCloneElement = (index: number) => {
    const elementModel = _model.value[index];
    if (!elementModel) {
        return;
    }

    const concept = findConcept(elementModel.$concept);
    if (!concept) {
        return;
    }

    let cloned: BaseConceptModel;

    if (props.item.cloneItemProvider) {
        cloned = props.item.cloneItemProvider?.(concept, elementModel, {
            app,
            rootModel: rootModel?.value,
            currentModel: props.model,
        });
    } else {
        cloned = cloneConceptModel(elementModel);
        if (typeof cloned.name === 'string') {
            cloned.name = incrementName(
                cloned.name,
                props.model.map((item) => item.name as string)
            );
        }
    }

    cloned.$id = uuid();
    _model.value.push(cloned);
    emitChange();
};

const onDeleteElement = async (index: number) => {
    const elementModel = _model.value[index];
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
        _model.value.splice(index, 1);
        emitChange();
    }
};

const onEnterConcept = (data: EnterConceptData, index: number) => {
    // append key and forward to parent
    emit('enter', { ...data, path: [index, ...data.path] });
};

const onElementSelected = ({ model, concept }: ConceptModelPair) => {
    emit('selectionChange', { concept, id: model.$id });
};

const emitChange = () => {
    emit('change', _model.value);
};

const isSelected = (element: BaseConceptModel) => {
    return currentSelection?.value?.concept.name === element.$concept && currentSelection?.value?.id === element.$id;
};

const selectedElement = computed(() => {
    return _model.value.find((element) => isSelected(element));
});

watch(selectedElement, (value) => {
    if (value) {
        // scroll the selected element into view
        const el = document.querySelector(`.concept-element-${thisInstanceId}-${_model.value.indexOf(value)}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: "nearest", inline: "nearest" });
        }
    }
});

const reachedMaxItems = computed(() => {
    return props.item.maxItems !== undefined && _model.value.length >= props.item.maxItems;
});
</script>

<template>
    <div class="flex flex-col gap-2">
        <ItemLabel v-if="!inline" :item="item" :model="props.model" :parent-model="props.parentModel" />

        <!-- draggable element list -->
        <draggable class="flex flex-col gap-2" handle=".handle" v-model="_model" :group="draggableGroup" item-key="$id"
            @change="onDragChanged">
            <template #item="{ element, index }">
                <div :class="{ 'border rounded p-3': !inline, 'border-blue-600': isSelected(element) }"
                    class="flex items-center w-full">
                    <div class="flex-grow" :class="`concept-element-${thisInstanceId}-${index}`">
                        <ConceptElement v-if="findConcept(element.$concept)" :concept="findConcept(element.$concept)"
                            :key="element.$id" :model="element" :parent="props.item" :inlineEditing="item.inline"
                            :allowDelete="_model.length > 1" :allowClone="!reachedMaxItems"
                            :allowAddSibling="!reachedMaxItems"
                            @add-sibling="(data: ConceptModelPair) => onAddSibling(index, data)"
                            @clone="() => onCloneElement(index)" @delete="() => onDeleteElement(index)"
                            @enter="(data: EnterConceptData) => onEnterConcept(data, index)"
                            @change="(data: BaseConceptModel) => onChangeElement(data, index)"
                            @selected="(data: ConceptModelPair) => onElementSelected(data)" />
                    </div>
                </div>
            </template>
        </draggable>

        <!-- footer button -->
        <CreateCandidateButton v-if="showCreateButton && !reachedMaxItems" :name="item.name"
            :candidates="item.candidates" @create="onCreate" />
    </div>
</template>
