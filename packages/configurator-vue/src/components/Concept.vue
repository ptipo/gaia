<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { CURRENT_ASPECT } from '@/lib/constants';
import type { BaseConceptModel, Concept } from '@gaia/configurator';
import { computed, defineAsyncComponent, inject, type Ref } from 'vue';
import { EnterConceptData } from './types';

const props = defineProps<{
    concept: Concept;
    model: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'enter', data: EnterConceptData): void;
    (e: 'change', data: BaseConceptModel): void;
}>();

const currentAspect = inject<Ref<string>>(CURRENT_ASPECT);

// filter items that are visible in the current aspect
const visibleItems = computed(() => {
    return Object.entries(props.concept.items).filter(([_, item]) => {
        let itemAspect = 'content';
        if (item.groupKey) {
            const group = props.concept.groups?.[item.groupKey];
            if (group?.aspect) {
                itemAspect = group.aspect;
            }
        }
        return itemAspect === currentAspect?.value;
    });
});

const onChange = (key: string, data: unknown) => {
    const nextModel = { ...props.model, [key]: data };
    emit('change', nextModel);
};

const onEnter = (key: string, data: EnterConceptData) => {
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
    <div class="flex flex-col gap-4 py-4">
        <component
            v-for="[key, item] in visibleItems"
            :key="key"
            :is="childComponents[key]"
            :item="item"
            :model="model[key]"
            :parentModel="model"
            @change="(data: unknown) => onChange(key, data)"
            @enter="(data: EnterConceptData) => onEnter(key, data)"
        ></component>
    </div>
</template>
