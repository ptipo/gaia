<script setup lang="ts">
import type { SwitchItem } from '@hayadev/configurator/items';
import { ref, watch, nextTick } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';

const props = defineProps<CommonProps<SwitchItem>>();

const emit = defineEmits<CommonEvents<SwitchItem>>();

const _model = ref(props.model);

watch(
    () => props.model,
    async (value) => {
        // element-plus's el-switch seems to have a racing issue when its model is watched,
        // make changes in nextTick to workaround it
        await nextTick();
        _model.value = value;
    }
);
</script>

<template>
    <el-form-item class="m-0">
        <div class="flex justify-between w-full">
            <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" />
            <el-switch v-model="_model" @change="$emit('change', _model)" />
        </div>
    </el-form-item>
</template>
