<script setup lang="ts">
import type { inferConfigItem } from '@gaia/configurator';
import type { TextItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<{
    item: TextItem;
    model: inferConfigItem<TextItem>;
}>();

defineEmits<{ (e: 'change', data: inferConfigItem<TextItem>): void }>();

const _model = ref(props.model);
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" />
        <el-input v-model="_model" @change="$emit('change', _model)" />
    </el-form-item>
</template>
