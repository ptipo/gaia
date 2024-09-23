<script setup lang="ts">
import {
    APP_KEY,
    CONFIG_TRANSLATOR_KEY,
    CURRENT_ASPECT_KEY,
    CURRENT_SELECTION_KEY,
    DEFAULT_ASPECT,
    IMAGE_UPLOADER_KEY,
    ROOT_MODEL_KEY,
} from '@/lib/constants';
import { useConfigI18n } from '@/lib/i18n';
import type { AppInstance, BaseConceptModel, Concept, SelectionData, ConfigAspects } from '@hayadev/configurator';
import { provide, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ConceptStack from './ConceptStack.vue';
import type { EditPathRecord, ImageUploader, ModelGenerationArgs } from './types';

const activeAspect = ref<ConfigAspects>(DEFAULT_ASPECT);

const props = defineProps<{
    app: AppInstance<Concept>;
    model: BaseConceptModel;
    imageUploader: ImageUploader;
    localeMessages: Record<string, Record<string, string>>;
}>();

// v-model for currently selected concept instance
const selection = defineModel<SelectionData>('selection');

// v-model for the current edit path
const editPath = defineModel<EditPathRecord[]>('editPath', { default: [] });

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
    (e: 'selectionChange', data: SelectionData): void;
    (e: 'generateModel', data: ModelGenerationArgs): void;
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
provide(CURRENT_SELECTION_KEY, selection);

provide(IMAGE_UPLOADER_KEY, props.imageUploader);

const { ct } = useConfigI18n(props.localeMessages);

provide(CONFIG_TRANSLATOR_KEY, ct);

const { t } = useI18n();

const aspects = [
    { label: t('content'), aspect: 'content', enableAi: true },
    { label: t('design'), aspect: 'design', enableAi: false },
    { label: t('settings'), aspect: 'setting', enableAi: false },
] as const;

const onChange = (data: BaseConceptModel) => {
    emit('change', data);
};

const onSelectionChange = (data: SelectionData) => {
    selection.value = data;
};

const onAspectChange = () => {
    // reset edit path to root when switching aspect
    editPath.value = [];
};

const onGenerateModel = () => {
    let userInputHint = '';
    let modelGenerationHint = '';
    if (props.app) {
        const appDef = props.app.def;
        if (appDef.generateModelHint) {
            userInputHint = appDef.generateModelHint({ kind: 'user-input', aspect: activeAspect.value, ct });
            modelGenerationHint = appDef.generateModelHint({
                kind: 'elaboration',
                aspect: activeAspect.value,
                ct,
            });
        }
    }
    emit('generateModel', { aspect: activeAspect.value, userInputHint, modelGenerationHint });
};

const isGenerateSupport = computed(() => {
    if (props.app) {
        const supportedAspects = props.app.def?.supportedGenerateAspects?.();
        if (supportedAspects?.includes(activeAspect.value)) return true;
    }
    return false;
});
</script>

<template>
    <div class="flex flex-col p-4 text-sm h-full">
        <el-tabs v-model="activeAspect" @tab-change="onAspectChange">
            <el-tab-pane v-for="{ label, aspect } in aspects" :label="label" :name="aspect"> </el-tab-pane>
        </el-tabs>

        <el-button v-if="isGenerateSupport" size="large" class="mb-2" @click="onGenerateModel">{{
            t(`aiGenerate-${activeAspect}`)
        }}</el-button>

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
