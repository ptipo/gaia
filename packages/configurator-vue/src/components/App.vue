<script setup lang="ts">
import {
    APP_KEY,
    CURRENT_ASPECT_KEY,
    DEFAULT_ASPECT,
    ROOT_MODEL_KEY,
} from '@/lib/constants';
import type {
    AppInstance,
    BaseConceptModel,
    Concept,
} from '@gaia/configurator';
import { provide, ref } from 'vue';
import ConceptStack from './ConceptStack.vue';

const activeAspect = ref(DEFAULT_ASPECT);

const props = defineProps<{
    app: AppInstance<Concept>;
}>();

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

const model = ref<BaseConceptModel>(props.app.model);

// provide the root model to children
provide(ROOT_MODEL_KEY, model);

// provide the current aspect to children
provide(CURRENT_ASPECT_KEY, activeAspect);

provide(APP_KEY, props.app);

const aspects = [
    { label: 'Content', aspect: 'content' },
    { label: 'Design', aspect: 'design' },
    { label: 'Setting', aspect: 'setting' },
] as const;

const onChange = (data: BaseConceptModel) => {
    model.value = data;
    emit('change', data);
};
</script>

<template>
    <div class="p-4 h-full overflow-auto text-sm">
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
