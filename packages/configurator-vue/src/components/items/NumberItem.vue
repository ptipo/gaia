<script setup lang="ts">
import type { inferConfigItem } from '@gaia/configurator';
import type { NumberItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<{
    item: NumberItem;
    model: inferConfigItem<NumberItem>;
}>();

defineEmits<{ (e: 'change', data: inferConfigItem<NumberItem>): void }>();

const _model = ref(props.model);
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" />
        <el-input-number
            :min="item.allowNegative ? undefined : 0"
            :precision="item.allowFloat ? 1 : undefined"
            v-model="_model"
            @change="$emit('change', _model)"
        />
    </el-form-item>
</template>
