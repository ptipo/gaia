<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import type { inferConfigItem } from '@gaia/configurator';
import type { GroupItem } from '@gaia/configurator/items';
import { computed, defineAsyncComponent } from 'vue';
import type { EnterConceptData } from '../types';

const props = defineProps<{
    item: GroupItem;
    model: inferConfigItem<GroupItem>;
}>();

const emit = defineEmits<{
    (e: 'change', data: inferConfigItem<GroupItem>): void;
    (e: 'enter', data: EnterConceptData): void;
}>();

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
    emit('enter', { ...data, parentKey: [key, ...data.parentKey] });
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
