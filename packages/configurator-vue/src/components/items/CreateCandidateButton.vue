<script setup lang="ts">
// A "create" button for creating a new item from a list of concept candidates

import { CONFIG_TRANSLATOR_KEY } from '@/lib/constants';
import { ident } from '@/lib/i18n';
import type { Concept, TranslationFunction } from '@hayadev/configurator';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    name: string;
    candidates: Concept[];
}>();

defineEmits<{
    (e: 'create', data: Concept): void;
}>();

const { t } = useI18n();
const ct = inject<TranslationFunction>(CONFIG_TRANSLATOR_KEY, ident);
</script>

<template>
    <!-- create an item directly if there's only one candidate -->
    <el-button
        v-if="candidates.length === 1"
        link
        type="info"
        class="self-start"
        @click="() => $emit('create', candidates[0])"
        ><el-icon><i-ep-plus /></el-icon> {{ t('addNew', { name: ct(name) }) }}</el-button
    >
    <!-- otherwise show a menu of candidates -->
    <el-dropdown trigger="click" v-else>
        <el-button link type="info" class="self-start"
            ><el-icon><i-ep-plus /></el-icon> {{ t('addNew', { name: ct(name) }) }}</el-button
        >
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="candidate in candidates" @click="() => $emit('create', candidate)">{{
                    ct(candidate.displayName)
                }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
