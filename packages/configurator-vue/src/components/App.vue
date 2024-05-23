<script setup lang="ts">
import { CURRENT_ASPECT, ROOT_MODEL_KEY } from '@/lib/constants';
import type { App, BaseConceptModel, Concept } from '@gaia/configurator';
import { provide, ref } from 'vue';
import ConceptStack from './ConceptStack.vue';

const activeAspect = ref('content');

const props = defineProps<{
    app: App<Concept>;
    model: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

// provide the root model to children
provide(ROOT_MODEL_KEY, props.model.value);

// provide the current aspect to children
provide(CURRENT_ASPECT, activeAspect);

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
                ><ConceptStack
                    :root-concept="app.concept"
                    :root-model="model"
                    @change="(data) => emit('change', data)"
                ></ConceptStack
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>
