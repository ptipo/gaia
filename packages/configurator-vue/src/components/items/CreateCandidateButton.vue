<script setup lang="ts">
// A "create" button for creating a new item from a list of concept candidates

import type { Concept } from '@hayadev/configurator';

defineProps<{
    name: string;
    candidates: Concept[];
}>();

defineEmits<{
    (e: 'create', data: Concept): void;
}>();
</script>

<template>
    <!-- create an item directly if there's only one candidate -->
    <el-button
        v-if="candidates.length === 1"
        link
        type="info"
        class="self-start"
        @click="() => $emit('create', candidates[0])"
        >+ 添加{{ name }}</el-button
    >
    <!-- otherwise show a menu of candidates -->
    <el-dropdown trigger="click" v-else>
        <el-button link type="info" class="self-start">+ 添加{{ name }}</el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="candidate in candidates" @click="() => $emit('create', candidate)">{{
                    candidate.displayName
                }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
