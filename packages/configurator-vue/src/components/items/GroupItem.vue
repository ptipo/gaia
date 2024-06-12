<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import type { GroupItem } from '@hayadev/configurator/items';
import { computed, defineAsyncComponent } from 'vue';
import type { EnterConceptData } from '../types';
import type { CommonEvents, CommonProps } from './common';

const props = defineProps<CommonProps<GroupItem>>();

const emit = defineEmits<
    CommonEvents<GroupItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();

const childComponents = computed(() => {
    return Object.entries(props.item.items).reduce((acc, [key, value]) => {
        acc[key] = getItemComponent(value);
        return acc;
    }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>);
});

const onChange = (key: string, data: unknown) => {
    const nextModel = { ...props.model, [key]: data };
    emit('change', nextModel);
};

const onEnter = (key: string, data: EnterConceptData) => {
    emit('enter', { ...data, path: [key, ...data.path] });
};
</script>

<template>
    <div>
        <div class="flex flex-col gap-4">
            <component
                v-for="(item, key) in item.items"
                :is="childComponents[key]"
                :item="item"
                :model="model[key]"
                :parentModel="model"
                @change="(data: unknown) => onChange(key, data)"
                @enter="(data: EnterConceptData) => onEnter(key, data)"
            />
        </div>
    </div>
</template>
