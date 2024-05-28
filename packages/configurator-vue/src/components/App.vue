<script setup lang="ts">
import { CURRENT_ASPECT, ROOT_MODEL_KEY } from '@/lib/constants';
import type { App, BaseConceptModel, Concept } from '@gaia/configurator';
import { provide, ref } from 'vue';
import ConceptStack from './ConceptStack.vue';

const activeAspect = ref('content');

defineProps<{
    app: App<Concept>;
}>();

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

const model = defineModel<BaseConceptModel>({ required: true });

// provide the root model to children
provide(ROOT_MODEL_KEY, model);

// provide the current aspect to children
provide(CURRENT_ASPECT, activeAspect);

const aspects = [
    { label: 'Content', aspect: 'content' },
    { label: 'Design', aspect: 'design' },
    { label: 'Setting', aspect: 'setting' },
] as const;

const onChange = (data: BaseConceptModel) => {
    model.value = data;
};
</script>

<template>
    <div class="p-4 h-full overflow-auto">
        <el-tabs v-model="activeAspect">
            <el-tab-pane
                v-for="{ label, aspect } in aspects"
                :label="label"
                :name="aspect"
            ></el-tab-pane>
        </el-tabs>
        <ConceptStack
            :root-concept="app.concept"
            :root-model="model"
            @change="onChange"
        ></ConceptStack>
    </div>
</template>
