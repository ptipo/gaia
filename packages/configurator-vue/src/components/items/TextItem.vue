<script setup lang="ts">
import type { TextItem } from '@hayadev/configurator/items';
import { ref, watch } from 'vue';
import RichTextEditor from '../RichTextEditor.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';
import ItemLabel from './ItemLabel.vue';

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

watch(
    () => props.model,
    (value) => {
        _model.value = value;
    }
);
</script>

<template>
    <el-form-item class="m-0 haya-text-item">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" v-model:enabled="enabled" />

        <template v-if="!item.guarded || enabled">
            <el-input v-if="!item.richText" v-model="_model" @change="$emit('change', _model)" />
            <RichTextEditor v-else v-model="_model" @change="$emit('change', _model)" />
        </template>
    </el-form-item>
</template>
