<script setup lang="ts">
import { NonPrimitiveTypes } from '@hayadev/configurator';
import { type CodeItem } from '@hayadev/configurator/items';
import type { EditorConfiguration } from 'codemirror';
import VueCodemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/css/css';
import debounce from 'debounce';
import { computed, ref, watch } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';

const props = defineProps<CommonProps<CodeItem>>();

const emit = defineEmits<CommonEvents<CodeItem>>();

const _model = ref(props.model?.source ?? '');

watch(
    () => props.model,
    (value) => {
        _model.value = value?.source ?? '';
    }
);

const { enabled } = useGuard(props.model !== undefined, {
    onSetOff: () => emit('change', undefined),
});

const codeMirrorOptions = computed(
    () =>
        ({
            mode: props.item.language,
            cursorHeight: 1,
            lineNumbers: false,
            lineWrapping: true,
        } satisfies EditorConfiguration)
);

const onChange = debounce((value: string) => {
    emit('change', { $type: NonPrimitiveTypes.code, source: value, language: props.item.language });
}, 200);
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" v-model:enabled="enabled" />
        <VueCodemirror
            v-model:value="_model"
            class="code-container border mt-2"
            :height="400"
            @change="onChange"
            :options="codeMirrorOptions"
        />
    </el-form-item>
</template>

<style scoped>
.code-container {
    line-height: 1.5;
    font-size: 14px;
}
</style>
