<script setup lang="ts">
import type { ConfigItemBase } from '@gaia/configurator/items';

defineProps<{
    item: ConfigItemBase;
}>();
</script>

<template>
    <div slot="label" class="flex items-center mb-2">
        <div class="text-sm">
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
</template>
