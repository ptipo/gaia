<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import type { BaseConceptModel, Concept } from '@gaia/configurator';
import { produce } from 'immer';
import { computed, defineAsyncComponent } from 'vue';
import { EnterConceptData } from './types';

const props = defineProps<{
    concept: Concept;
    model: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'enter', data: EnterConceptData): void;
    (e: 'change', data: BaseConceptModel): void;
}>();

const onChange = (key: string, data: unknown) => {
    const nextModel = produce(props.model, (draft) => {
        draft[key] = data;
    });
    emit('change', nextModel);
};

const onEnter = (key: string, data: EnterConceptData) => {
    console.log('Concept enter:', key, data);
    emit('enter', { ...data, parentKey: [key, ...data.parentKey] });
};

const childComponents = computed(() => {
    return Object.entries(props.concept.items).reduce((acc, [key, value]) => {
        acc[key] = getItemComponent(value);
        return acc;
    }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>);
});
</script>

<template>
    <div class="flex flex-col gap-6 py-4">
        <div v-for="(item, key) in concept.items" :key="key">
            <component
                :is="childComponents[key]"
                :item="item"
                :parentModel="model"
                :model="model[key]"
                @change="(data: unknown) => onChange(key, data)"
                @enter="(data: EnterConceptData) => onEnter(key, data)"
            ></component>
        </div>
    </div>
</template>
