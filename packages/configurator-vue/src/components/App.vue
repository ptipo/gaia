<script setup lang="ts">
import { APP_KEY, CURRENT_ASPECT_KEY, DEFAULT_ASPECT, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept } from '@gaia/configurator';
import { provide, ref, watch } from 'vue';
import ConceptStack from './ConceptStack.vue';

const activeAspect = ref(DEFAULT_ASPECT);

const props = defineProps<{
    app: AppInstance<Concept>;
    model: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
}>();

const _model = ref<BaseConceptModel>(props.model);

watch(
    () => props.model,
    (value) => {
        _model.value = value;
    }
);

// provide the root model to children
provide(ROOT_MODEL_KEY, _model);

// provide the current aspect to children
provide(CURRENT_ASPECT_KEY, activeAspect);

provide(APP_KEY, props.app);

const aspects = [
    { label: 'Content', aspect: 'content' },
    { label: 'Design', aspect: 'design' },
    { label: 'Setting', aspect: 'setting' },
] as const;

const onChange = (data: BaseConceptModel) => {
    emit('change', data);
};
</script>

<template>
    <div class="p-4 h-full overflow-auto text-sm">
        <el-tabs v-model="activeAspect">
            <el-tab-pane v-for="{ label, aspect } in aspects" :label="label" :name="aspect"></el-tab-pane>
        </el-tabs>
        <ConceptStack :root-concept="app.concept" :root-model="_model" @change="onChange"></ConceptStack>
    </div>
</template>
