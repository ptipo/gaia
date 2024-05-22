<script setup lang="ts">
import {
    createConceptModel,
    type BaseConceptModel,
    type inferConfigItem,
} from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';

const props = defineProps<{ item: HasManyItem }>();
const model = defineModel<inferConfigItem<HasManyItem>>({ default: [] });

const onCreate = () => {
    // TODO: deal with multiple candidates
    const concept = props.item.candidates[0];

    const newItem =
        props.item.newItemProvider?.(concept, model.value) ??
        createConceptModel(concept);

    model.value = [...model.value, newItem];
};

const findConcept = (name: string) => {
    return props.item.candidates.find((c) => c.name === name);
};

const onDeleteElement = (data: BaseConceptModel) => {
    model.value = model.value.filter((e) => e !== data);
};
</script>

<template>
    <div class="flex flex-col">
        <div class="text-sm mb-2">{{ item.name }}</div>
        <div class="flex flex-col gap-2">
            <div class="border rounded p-3" v-for="(value, key) in model">
                <ConceptElement
                    v-if="findConcept(value.$concept)"
                    :concept="findConcept(value.$concept)"
                    v-model="model[key]"
                    @delete="onDeleteElement"
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
