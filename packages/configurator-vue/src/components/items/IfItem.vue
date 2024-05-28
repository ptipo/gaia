<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { ROOT_MODEL_KEY } from '@/lib/constants';
import {
    createItemModel,
    type BaseConceptModel,
    type inferConfigItem,
} from '@gaia/configurator';
import type { IfItem } from '@gaia/configurator/items';
import { Ref, computed, inject, watch } from 'vue';
import { EnterConceptData } from '../types';

const props = defineProps<{
    item: IfItem;
    parentModel: BaseConceptModel;
    model: inferConfigItem<IfItem>;
}>();

const emit = defineEmits<{
    (e: 'change', data: inferConfigItem<IfItem>): void;
    (e: 'enter', data: EnterConceptData): void;
}>();

const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const childComponent = getItemComponent(props.item.child);

const condition = computed(() => {
    return props.item.condition?.({
        rootModel: rootModel?.value,
        currentModel: props.parentModel,
    });
});

watch(condition, (value, oldValue) => {
    if (value && !oldValue) {
        // recreate model
        emit('change', createItemModel(props.item.child));
    }
});
</script>

<template>
    <component
        v-if="condition"
        :is="childComponent"
        :item="item.child"
        :model="model"
        :parentModel="parentModel"
        @change="(data: unknown) => $emit('change', data)"
        @enter="(data: EnterConceptData) => $emit('enter', data)"
    ></component>
</template>
