<script setup lang="ts">
import type { HasItem } from '@hayadev/configurator/items';
import type { EnterConceptData } from '../types';
import type { CommonEvents, CommonProps } from './common';

defineProps<CommonProps<HasItem>>();

const emit = defineEmits<
    CommonEvents<HasItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();
</script>

<template>
    <div class="cursor-pointer" @click="$emit('enter', { concept: item.concept, model, path: [] })">
        {{ item.concept.displayName ?? item.concept.name }}
    </div>
</template>
