<script setup lang="ts">
import type { ElColorPicker } from 'element-plus';
import { ref } from 'vue';
import { PredefinedColors } from '~/lib/color';

const rteEditColor = ref('');
const rteEditColorEl = ref<typeof ElColorPicker>();
const onRteEditColorChange = ref<((color: string | null) => void) | undefined>();

const openColorPicker = (onColorChange: (color: string | null) => void) => {
    onRteEditColorChange.value = onColorChange;
    rteEditColorEl.value?.show();
};

defineExpose({ openColorPicker });
</script>

<template>
    <el-color-picker
        v-model="rteEditColor"
        ref="rteEditColorEl"
        show-alpha
        :predefine="PredefinedColors"
        :teleported="false"
        @blur="onRteEditColorChange = undefined"
        @change="(color) => onRteEditColorChange?.(color)"
    />
</template>
