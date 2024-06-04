<script setup lang="ts">
import type { SwitchItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';

const props = defineProps<CommonProps<SwitchItem>>();

const emit = defineEmits<CommonEvents<SwitchItem>>();

const _model = ref(props.model);
</script>

<template>
    <el-form-item class="m-0">
        <div class="flex justify-between w-full">
            <ItemLabel :item="item" />
            <el-switch v-model="_model" @change="$emit('change', _model)" />
        </div>
    </el-form-item>
</template>
