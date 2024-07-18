<script setup lang="ts">
import type { TextItem } from '@hayadev/configurator/items';
import { Bold, Color, Document, ElementTiptap, Italic, Link, Paragraph, Strike, Text, Underline } from 'element-tiptap';
import zh from 'element-tiptap/lib/locales/zh';
import 'element-tiptap/lib/style.css';

import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';

const props = defineProps<CommonProps<TextItem>>();

const emit = defineEmits<CommonEvents<TextItem>>();

const { enabled } = useGuard(props.model !== undefined, {
    onSetOn: () => {
        _model.value = '';
        emit('change', _model.value);
    },
    onSetOff: () => {
        _model.value = undefined;
        emit('drop');
    },
});

const _model = ref<string | undefined>(props.model);

const extensions = [Document, Text, Paragraph, Bold, Underline, Italic, Strike, Link, Color];
</script>

<template>
    <el-form-item class="m-0 haya-text-item">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" v-model:enabled="enabled" />

        <template v-if="!item.guarded || enabled">
            <el-input v-if="!item.richText" v-model="_model" @change="$emit('change', _model)" />
            <ElementTiptap
                v-else
                v-model:content="_model"
                :extensions="extensions"
                :enable-char-count="false"
                :locale="zh"
                :tooltip="false"
                @onBlur="$emit('change', _model)"
            />
        </template>
    </el-form-item>
</template>

<style>
.haya-text-item .el-tiptap-editor__content {
    @apply p-4;
}

.haya-text-item .el-tiptap-editor div[data-tippy-root] {
    @apply hidden;
}
</style>
