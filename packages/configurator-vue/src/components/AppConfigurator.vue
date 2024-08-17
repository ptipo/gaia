<script setup lang="ts">
import {
    APP_KEY,
    CURRENT_ASPECT_KEY,
    CURRENT_SELECTION_KEY,
    DEFAULT_ASPECT,
    IMAGE_UPLOADER_KEY,
    ROOT_MODEL_KEY,
    CONFIG_TRANSLATOR_KEY,
} from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept, SelectionData } from '@hayadev/configurator';
import { computed, provide, ref, watch } from 'vue';
import ConceptStack from './ConceptStack.vue';
import type { EditPathRecord, ImageUploader } from './types';
import { useI18n, createI18n } from 'vue-i18n';
import { getTranslator } from '@/lib/i18n';

const activeAspect = ref(DEFAULT_ASPECT);

const props = defineProps<{
    app: AppInstance<Concept>;
    model: BaseConceptModel;
    imageUploader: ImageUploader;
    localeMessages: Record<string, Record<string, string>>;
    locale: string;
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
provide(CURRENT_SELECTION_KEY, selection);

provide(IMAGE_UPLOADER_KEY, props.imageUploader);

const configI18n = createI18n({ legacy: false, messages: props.localeMessages, locale: props.locale });

const configTranslate = computed(() => getTranslator(configI18n as any));
watch(
    () => props.locale,
    (value) => {
        configI18n.global.locale.value = value;
    }
);

provide(CONFIG_TRANSLATOR_KEY, configTranslate);

const { t } = useI18n();

const aspects = [
    { label: t('content'), aspect: 'content' },
    { label: t('design'), aspect: 'design' },
    { label: t('settings'), aspect: 'setting' },
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
</script>

<template>
    <div class="flex flex-col p-4 text-sm h-full">
        <el-tabs v-model="activeAspect" @tab-change="onAspectChange">
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
