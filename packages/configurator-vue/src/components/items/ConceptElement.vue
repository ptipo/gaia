<script setup lang="ts">
import type { BaseConceptModel, Concept } from '@gaia/configurator';

defineProps<{ concept: Concept }>();
defineEmits<{ (e: 'delete', data: BaseConceptModel): void }>();

const model = defineModel<BaseConceptModel>();
</script>

<template>
    <div class="flex justify-between">
        <div class="text-sm">
            {{ model?.name || concept.name }}
        </div>
        <el-dropdown v-if="model">
            <el-icon class="cursor-pointer">
                <i-ep-more-filled />
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu class="text-sm">
                    <el-dropdown-item @click="$emit('delete', model!)"
                        >删除</el-dropdown-item
                    >
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
