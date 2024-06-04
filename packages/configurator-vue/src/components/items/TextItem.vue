<script setup lang="ts">
import type { TextItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';

const props = defineProps<CommonProps<TextItem>>();

const emit = defineEmits<CommonEvents<TextItem>>();

const { enabled } = useGuard(props.model !== undefined, {
    onSetOff: () => emit('change', undefined),
});

const _model = ref<string | undefined>(props.model);
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" v-model="enabled" />
        <el-input
            v-if="!item.guarded || enabled"
            v-model="_model"
            @change="$emit('change', _model)"
        />
    </el-form-item>
</template>
