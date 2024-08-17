<script setup lang="ts">
import { CONFIG_TRANSLATOR_KEY } from '@/lib/constants';
import { ident } from '@/lib/i18n';
import { TranslationFunction } from '@hayadev/configurator';
import type { HasItem } from '@hayadev/configurator/items';
import { inject } from 'vue';
import type { EnterConceptData } from '../types';
import type { CommonEvents, CommonProps } from './common';

defineProps<CommonProps<HasItem>>();

const emit = defineEmits<
    CommonEvents<HasItem> & {
        (e: 'enter', data: EnterConceptData): void;
    }
>();

const ct = inject<TranslationFunction>(CONFIG_TRANSLATOR_KEY, ident);
</script>

<template>
    <div class="cursor-pointer" @click="$emit('enter', { concept: item.concept, model, path: [] })">
        {{ ct(item.concept.displayName ?? item.concept.name) }}
    </div>
</template>
