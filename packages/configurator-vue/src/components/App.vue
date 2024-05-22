<script setup lang="ts">
import type { App, BaseConceptModel, Concept } from '@gaia/configurator';
import { defineModel, ref } from 'vue';
import ConceptConfigurator from './Concept.vue';

const activeAspect = ref('content');

defineProps<{
    app: App<Concept>;
}>();

const model = defineModel<BaseConceptModel>();

const aspects = [
    { label: 'Content', aspect: 'content' },
    { label: 'Design', aspect: 'design' },
    { label: 'Setting', aspect: 'setting' },
] as const;
</script>

<template>
    <div class="p-4">
        <el-tabs v-model="activeAspect">
            <el-tab-pane
                v-for="{ label, aspect } in aspects"
                :label="label"
                :name="aspect"
                ><ConceptConfigurator
                    :concept="app.concept"
                    v-if="model?.$type === 'concept'"
                    v-model="model"
                    :aspect="aspect"
                ></ConceptConfigurator
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>
