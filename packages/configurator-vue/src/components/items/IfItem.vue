<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept } from '@hayadev/configurator';
import type { IfItem } from '@hayadev/configurator/items';
import { Ref, computed, inject, onMounted, watch } from 'vue';
import type { EnterConceptData } from '../types';
import type { CommonEvents, CommonProps } from './common';

const props = defineProps<
    CommonProps<IfItem> & {
        parentModel: BaseConceptModel;
    }
>();

const emit = defineEmits<
    CommonEvents<IfItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const childComponent = getItemComponent(props.item.child);

const condition = computed(() => {
    return props.item.conditionProvider?.({
        app: app!,
        rootModel: rootModel?.value,
        currentModel: props.parentModel,
    });
});

onMounted(() => {
    if (condition.value && !props.model) {
        emit('change', app!.createItemModel(props.item.child));
    }
});

watch(condition, (value) => {
    if (value) {
        // recreate model
        emit('change', app!.createItemModel(props.item.child));
    } else {
        // clear model
        emit('drop');
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
