<script setup lang="ts">
import type { ColorItem, RGBA } from '@hayadev/configurator/items';
import { inject, ref, watch } from 'vue';
import { type CommonEvents, type CommonProps } from './common';
import { useGuard } from './guard';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<CommonProps<ColorItem>>();
const emit = defineEmits<CommonEvents<ColorItem>>();
const predefinedColors = inject<string[]>('predefinedColors', []);

const { enabled } = useGuard(props.model !== undefined, {
    onSetOn: () => {
        emit('change', _model.value);
    },
    onSetOff: () => {
        _model.value = undefined;
        emit('drop');
    },
});

const _model = ref<RGBA | undefined>(props.model);

watch(
    () => props.model,
    (value) => {
        _model.value = value;
    }
);

const onColorChange = (value: RGBA) => {
    if (!value) {
        delete _model.value;
        emit('drop');
    } else {
        _model.value = value;
        emit('change', value);
    }
};
</script>

<template>
    <el-form-item class="m-0 haya-text-item">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" v-model:enabled="enabled" />

        <template v-if="!item.guarded || enabled">
            <el-color-picker v-model="_model" show-alpha :predefine="predefinedColors" @change="onColorChange" />
        </template>
    </el-form-item>
</template>
