<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { ROOT_MODEL_KEY } from '@/lib/constants';
import type { BaseConceptModel, inferConfigItem } from '@gaia/configurator';
import type { IfItem } from '@gaia/configurator/items';
import { computed, inject } from 'vue';
import { EnterConceptData } from '../types';

const props = defineProps<{
    item: IfItem;
    parentModel: BaseConceptModel;
    model: inferConfigItem<IfItem>;
}>();

defineEmits<{
    (e: 'change', data: inferConfigItem<IfItem>): void;
    (e: 'enter', data: EnterConceptData): void;
}>();

const rootModel = inject(ROOT_MODEL_KEY);

const childComponent = getItemComponent(props.item.child);

const condition = computed(() => {
    return props.item.condition?.({
        rootModel,
        currentModel: props.parentModel,
    });
});
</script>

<template>
    <component
        v-if="condition"
        :is="childComponent"
        :item="item.child"
        :model="model"
        @change="(data: unknown) => $emit('change', data)"
        @enter="(data: EnterConceptData) => $emit('enter', data)"
    ></component>
</template>
