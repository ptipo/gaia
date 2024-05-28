<script setup lang="ts">
import { BaseConceptModel, Concept } from '@gaia/configurator';
import deepcopy from 'deepcopy';
import { computed, ref } from 'vue';
import ConceptConfigurator from './Concept.vue';

const props = defineProps<{
    rootConcept: Concept;
    rootModel: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

// keep track of a stack of concepts
type Record = { parentKey: Array<number | string>; concept: Concept };
const stack = ref<Record[]>([{ parentKey: [], concept: props.rootConcept }]);

const currentConcept = computed(() => {
    const record = stack.value[stack.value.length - 1];
    return record.concept;
});

const currentModel = computed(() => {
    const record = stack.value[stack.value.length - 1];
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
    return stack.value[stack.value.length - 2]?.concept;
});

const onChange = (data: BaseConceptModel) => {
    const record = stack.value[stack.value.length - 1];
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

const onEnter = (data: Record) => {
    const prevKey = stack.value[stack.value.length - 1]?.parentKey ?? [];
    const newKey = [...prevKey, ...data.parentKey];
    stack.value = [...stack.value, { ...data, parentKey: newKey }];
};

const goBack = () => {
    stack.value.pop();
};
</script>

<template>
    <el-page-header v-if="previousConcept" @back="goBack">
        <template #title>{{ previousConcept.displayName }}</template>
    </el-page-header>
    <ConceptConfigurator
        :concept="currentConcept"
        :model="currentModel"
        @change="onChange"
        @enter="onEnter"
    ></ConceptConfigurator>
</template>
