<script setup lang="ts">
import type { NumberItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';

const props = defineProps<CommonProps<NumberItem>>();

const emit = defineEmits<CommonEvents<NumberItem>>();

const _model = ref(props.model);

const { enabled } = useGuard(props.model !== undefined, {
    onSetOff: () => emit('change', undefined),
});
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" v-model="enabled" />
        <el-input-number
            v-if="!item.guarded || enabled"
            :min="item.allowNegative ? undefined : 0"
            :precision="item.allowFloat ? 1 : undefined"
            v-model="_model"
            @change="$emit('change', _model)"
        />
    </el-form-item>
</template>
