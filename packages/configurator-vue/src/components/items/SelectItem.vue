<script setup lang="ts">
import type { inferConfigItem } from '@gaia/configurator';
import type { SelectItem } from '@gaia/configurator/items';
import { computed, ref } from 'vue';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<{
    item: SelectItem;
    model: inferConfigItem<SelectItem>;
}>();

defineEmits<{ (e: 'change', data: inferConfigItem<SelectItem>): void }>();

const _model = ref(props.model);

const options = computed(() => {
    if (!props.item.options) {
        return [];
    }
    return Object.entries(props.item.options).map(([key, value]) => ({
        value: key,
        label: value,
    }));
});
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" />
        <el-select
            v-model="_model"
            placeholder="请选择"
            @change="$emit('change', _model)"
        >
            <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            ></el-option>
        </el-select>
    </el-form-item>
</template>
