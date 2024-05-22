<script setup lang="ts">
import type { BaseConceptModel, Concept, ConfigItem } from '@gaia/configurator';
import capitalize from 'capitalize';
import { defineAsyncComponent, defineModel } from 'vue';

defineProps<{
    concept: Concept;
    aspect?: 'content' | 'design' | 'setting';
}>();

const model = defineModel<BaseConceptModel>();

function getItemComponent(item: ConfigItem) {
    return defineAsyncComponent(
        () =>
            import(
                `./items/${item.type
                    .split('-')
                    .map((word) => capitalize(word))
                    .join('')}Item.vue`
            )
    );
}
</script>

<template>
    <div class="flex flex-col gap-6 py-4">
        <div v-for="(item, key) in concept.items">
            <component
                v-if="model"
                :is="getItemComponent(item)"
                :item="item"
                v-model="model[key]"
            ></component>
        </div>
    </div>
</template>
