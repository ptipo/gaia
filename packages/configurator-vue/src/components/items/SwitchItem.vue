<script setup lang="ts">
import type { inferConfigItem } from '@gaia/configurator';
import type { SwitchItem } from '@gaia/configurator/items';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<{
    item: SwitchItem;
    model: inferConfigItem<SwitchItem>;
}>();

defineEmits<{ (e: 'change', data: inferConfigItem<SwitchItem>): void }>();

const _model = ref(props.model);
</script>

<template>
    <el-form-item class="m-0">
        <div class="flex justify-between w-full">
            <ItemLabel :item="item" />
            <el-switch
                class="block"
                v-model="_model"
                @change="$emit('change', _model)"
            />
        </div>
    </el-form-item>
</template>
