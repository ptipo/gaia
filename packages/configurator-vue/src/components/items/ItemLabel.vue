<script setup lang="ts">
import type { ConfigItemBase } from '@gaia/configurator/items';

defineProps<{
    item: ConfigItemBase;
}>();

const model = defineModel<boolean>();
</script>

<template>
    <div slot="label" class="flex items-center justify-between w-full">
        <div class="flex items-center">
            <div>
                {{ item.name }}
            </div>
            <el-tooltip
                v-if="item.help"
                class="box-item"
                effect="dark"
                :content="item.help"
                placement="top"
                ><el-icon class="ml-2"><i-ep-info-filled /></el-icon
            ></el-tooltip>
        </div>
        <el-switch v-if="item.guarded" v-model="model"></el-switch>
    </div>
</template>
