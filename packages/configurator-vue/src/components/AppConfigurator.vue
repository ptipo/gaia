<script setup lang="ts">
import { APP_KEY, CURRENT_ASPECT_KEY, CURRENT_SELECTION, DEFAULT_ASPECT, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept } from '@hayadev/configurator';
import { provide, ref, watch } from 'vue';
import ConceptStack from './ConceptStack.vue';
import type { EditPathRecord, SelectionData } from './types';

const activeAspect = ref(DEFAULT_ASPECT);

const props = defineProps<{
    app: AppInstance<Concept>;
    model: BaseConceptModel;
}>();

// v-model for currently selected concept instance
const selection = defineModel<SelectionData>('selection');

// v-model for the current edit path
const editPath = defineModel<EditPathRecord[]>('editPath', { default: [] });

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
    (e: 'selectionChange', data: SelectionData): void;
}>();

const _model = ref<BaseConceptModel>({ ...props.model });

watch(
    () => props.model,
    (value) => {
        _model.value = { ...value };
    }
);

// provide the root model to descendants
provide(ROOT_MODEL_KEY, _model);

// provide the current aspect to descendants
provide(CURRENT_ASPECT_KEY, activeAspect);

// provide the current app to descendants
provide(APP_KEY, props.app);

// provide the current selected concept instance to descendants
provide(CURRENT_SELECTION, selection);

const aspects = [
    { label: 'Content', aspect: 'content' },
    { label: 'Design', aspect: 'design' },
    { label: 'Setting', aspect: 'setting' },
] as const;

const onChange = (data: BaseConceptModel) => {
    emit('change', data);
};

const onSelectionChange = (data: SelectionData) => {
    selection.value = data;
};
</script>

<template>
    <div class="flex flex-col p-4 text-sm h-full">
        <el-tabs v-model="activeAspect">
            <el-tab-pane v-for="{ label, aspect } in aspects" :label="label" :name="aspect"> </el-tab-pane>
        </el-tabs>
        <div class="flex-grow overflow-auto">
            <ConceptStack
                :root-concept="app.concept"
                :root-model="_model"
                v-model:editPath="editPath"
                @change="onChange"
                @selectionChange="onSelectionChange"
            ></ConceptStack>
        </div>
    </div>
</template>
