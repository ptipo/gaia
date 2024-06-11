<script setup lang="ts">
import type { BaseConceptModel, Concept, ConfigItem } from '@gaia/configurator';
import deepcopy from 'deepcopy';
import { computed, ref, watch } from 'vue';
import ConceptConfigurator from './ConceptConfigurator.vue';
import type { EditPathRecord, EnterConceptData, SelectionData } from './types';

const props = defineProps<{
    rootConcept: Concept;
    rootModel: BaseConceptModel;
}>();

const editPath = defineModel<EditPathRecord[]>('editPath', { default: [] });

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
    (e: 'selectionChange', data: SelectionData): void;
}>();

type StackItem = {
    concept: Concept;
    model: BaseConceptModel;
    path: EditPathRecord[];
};

const conceptStack = ref<StackItem[]>([]);

const refreshStack = (newPath: EditPathRecord[]) => {
    let item: any = props.rootConcept;
    let model: any = props.rootModel;
    let cumulatedPath: EditPathRecord[] = [];

    conceptStack.value = [
        {
            concept: props.rootConcept,
            model: props.rootModel,
            path: [],
        },
    ];

    for (const part of newPath) {
        model = model[part];
        cumulatedPath.push(part);
        if (typeof part === 'number') {
            if (item.type === 'has-many' && model.$concept) {
                // follow 'has-many' relation
                const concept = item.candidates.find((c: Concept) => c.name === model.$concept);
                if (concept && !item.inline) {
                    conceptStack.value.push({ concept, model, path: [...cumulatedPath] });
                }
                item = concept;
            } else {
                item = undefined;
            }
        } else {
            item = item?.items?.[part];
            if (item?.type === 'has') {
                // follow 'has' relation
                item = item.concept;
                if (!item.inline) {
                    conceptStack.value.push({ concept: item, model, path: [...cumulatedPath] });
                }
            } else {
                // unwrap 'if'
                item = unwrapIf(item);
            }
        }

        if (!model || !item) {
            break;
        }
    }
};

watch(
    editPath,
    (value) => {
        refreshStack(value ?? []);
    },
    { immediate: true }
);

watch(
    () => props.rootModel,
    () => {
        refreshStack(editPath.value);
    }
);

const unwrapIf = (item: ConfigItem): ConfigItem => {
    if (item?.type !== 'if') {
        return item;
    }
    return unwrapIf(item.child);
};

const currentConcept = computed(() => {
    const record = conceptStack.value[conceptStack.value.length - 1];
    return record.concept;
});

const currentModel = computed(() => {
    const record = conceptStack.value[conceptStack.value.length - 1];
    return record.model;
});

const parentConcept = computed(() => {
    return conceptStack.value[conceptStack.value.length - 2]?.concept;
});

const onChange = (data: BaseConceptModel) => {
    const path = conceptStack.value[conceptStack.value.length - 1].path;

    if (path.length === 0) {
        emit('change', data);
        return;
    }

    const nextModel = deepcopy(props.rootModel);

    // find the parent object
    let curr: any = nextModel;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        curr = curr[key];
    }

    // update the parent object
    const key = path[path.length - 1];
    curr[key] = data;

    if (typeof key === 'number') {
        // it must belong to a "has-many" item of a parent concept
        const prevKey = path[path.length - 2];
        if (prevKey) {
            const parentItem = unwrapIf(parentConcept.value.items[prevKey]);
            if (parentItem.type === 'has-many') {
                // call the "onChildChange" hook
                parentItem.onChildChange?.(data, curr);
            }
        }
    }

    emit('change', nextModel);
};

const onEnter = (data: EnterConceptData) => {
    const prev = conceptStack.value[conceptStack.value.length - 1];
    const newPath = [...prev.path, ...data.path];
    conceptStack.value.push({
        concept: data.concept,
        model: data.model,
        path: [...newPath],
    });
    editPath.value = [...newPath];
};

const goBack = () => {
    if (conceptStack.value.length > 1) {
        conceptStack.value = conceptStack.value.slice(0, -1);
        editPath.value = conceptStack.value[conceptStack.value.length - 1].path;
    }
};
</script>

<template>
    <div class="h-full overflow-auto">
        <el-page-header v-if="parentConcept" @back="goBack" class="mb-4">
            <template #title>{{ currentConcept.displayName }}</template>
        </el-page-header>
        <ConceptConfigurator
            :concept="currentConcept"
            :model="currentModel"
            @change="onChange"
            @enter="onEnter"
            @selectionChange="(data) => $emit('selectionChange', data)"
        ></ConceptConfigurator>
    </div>
</template>
