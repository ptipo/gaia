<script setup lang="ts">
import { BaseConceptModel, Concept } from '@gaia/configurator';
import deepcopy from 'deepcopy';
import { computed } from 'vue';
import ConceptConfigurator from './ConceptConfigurator.vue';
import type { EditPathRecord } from './types';

const props = defineProps<{
    rootConcept: Concept;
    rootModel: BaseConceptModel;
}>();

const currentPath = defineModel<EditPathRecord[]>('currentPath', { required: true });

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

const currentConcept = computed(() => {
    const record = currentPath.value[currentPath.value.length - 1];
    return record.concept;
});

const currentModel = computed(() => {
    const record = currentPath.value[currentPath.value.length - 1];
    let curr: any = props.rootModel;
    for (const key of record.parentKey) {
        curr = curr[key];
        if (!curr) {
            return undefined;
        }
    }
    return curr;
});

const previousConcept = computed(() => {
    return currentPath.value[currentPath.value.length - 2]?.concept;
});

const onChange = (data: BaseConceptModel) => {
    const record = currentPath.value[currentPath.value.length - 1];
    if (record.parentKey.length === 0) {
        emit('change', data);
        return;
    }

    const nextModel = deepcopy(props.rootModel);

    // find the parent object
    let curr: any = nextModel;
    for (let i = 0; i < record.parentKey.length - 1; i++) {
        const key = record.parentKey[i];
        curr = curr[key];
    }

    // update the parent object
    curr[record.parentKey[record.parentKey.length - 1]] = data;

    emit('change', nextModel);
};

const onEnter = (data: EditPathRecord) => {
    const prevKey = currentPath.value[currentPath.value.length - 1]?.parentKey ?? [];
    const newKey = [...prevKey, ...data.parentKey];
    currentPath.value = [...currentPath.value, { parentKey: newKey, concept: data.concept }];
};

const goBack = () => {
    currentPath.value = currentPath.value.slice(0, -1);
};
</script>

<template>
    <el-page-header v-if="previousConcept" @back="goBack" class="mb-4">
        <template #title>{{ currentConcept.displayName }}</template>
    </el-page-header>
    <ConceptConfigurator
        :concept="currentConcept"
        :model="currentModel"
        @change="onChange"
        @enter="onEnter"
    ></ConceptConfigurator>
</template>
