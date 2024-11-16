<script lang="ts" setup>
import type { AppInstance, Concept, inferConcept } from '@hayadev/configurator';
import {
    createAppInstance,
    modelEquals,
    SELECTION_CHANGE_EVENT,
    type BaseConceptModel,
    type SelectionData,
    type ValidationIssue,
} from '@hayadev/configurator';
import {
    addInlineEditEventHandlers,
    AppConfigurator,
    ValidationIssues,
    type EditPathRecord,
    type ModelGenerationArgs,
} from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import type { App, Asset, Prisma } from '@prisma/client';
import byteSize from 'byte-size';
import confetti from 'canvas-confetti';
import type { DropdownInstance } from 'element-plus';
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';
import { z } from 'zod';
import InlineRteEditor from '~/components/InlineRteEditor.vue';
import { useDeleteAsset, useFindUniqueAsset, useFindUniqueUser, useUpdateAsset } from '~/composables/data';
import { useUnsavedChangesWarning } from '~/composables/unsavedChangeWarning';
import { loadAppBundle } from '~/lib/app';
import { alert, confirmDelete, error, success } from '~/lib/message';
import { PredefinedColors } from '../../lib/color';

const route = useRoute();

const user = useUser();

const runtimeConfig = useRuntimeConfig();

const { isUnsaved } = useUnsavedChangesWarning();

const appInstance = ref<AppInstance<Concept>>();
const model = ref<BaseConceptModel>();
const hasError = ref(false);
const appContainerEl = ref<HTMLElement>();
const appEl = ref<HTMLElement>();

// current edit path in the configurator
const editPath = ref<EditPathRecord[]>([]);

// current selected concept instance
const selection = ref<SelectionData>();

// renaming
const editNameEl = ref<HTMLElement>();
const editName = ref<string | undefined>();

// validation issues
const issues = ref<ValidationIssue[]>([]);

// validation issues dropdown
const issuesDropdown = ref<DropdownInstance>();

const isPublishingAsset = ref(false);

const isPreviewAsset = ref(false);

const isMobile = ref(false);

// JSON editor states
const isShowJSON = ref(false);
const isJSONEditorPermission = ref(false);
const jsonEditorModel = ref();

const isAIPermission = ref(false);
const aiDialogVisible = ref(false);
const aiInput = ref('');
const aiInputEl = ref<HTMLElement>();

const aiGeneratingProgress = ref(0);
let aiTimer: NodeJS.Timeout | null;

const inlineRteEditor = ref<typeof InlineRteEditor>();

interface UserPermission {
    jsonEditor?: boolean;
    ai?: boolean;
}

const {
    data: asset,
    isLoading,
    error: loadError,
} = useFindUniqueAsset({
    where: { id: route.params.id as string },
    include: { app: true },
});

const { data: userData } = useFindUniqueUser({
    where: { id: user?.value?.id },
});

const { t } = useI18n();

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
});

watch([asset, isLoading], ([assetValue, isLoadingValue]) => {
    if (!isLoadingValue && assetValue === null) {
        console.error('Asset not found:', route.params.id);
        throw createError({
            statusCode: 404,
            statusMessage: t('assetNotFound'),
            fatal: true,
        });
    }
});

watch(loadError, (value) => {
    if (value) {
        console.error('Failed to load asset:', value);
        error(t('unableToLoadAsset'));
        navigateTo('/');
    }
});

const { mutateAsync: saveAsset, isPending: isSavingAsset } = useUpdateAsset();
const { mutateAsync: deleteAsset, isPending: isDeletingAsset } = useDeleteAsset();

const serializeConfig = () => JSON.stringify({ appVersion: appInstance.value?.version, model: model.value });

const localeMessages = ref<Record<string, Record<string, string>>>({});

const initializeApp = async (app: App) => {
    if (appEl.value) {
        // already created
        return;
    }

    if (!asset.value) {
        // asset not ready
        return;
    }

    if (!app.bundle) {
        console.error('No bundle found in the app instance.');
        error(t('unableToLoadAssetApp'));
        return;
    }

    try {
        console.log('Loading app bundle from:', app.bundle);

        const { module, version } = await loadAppBundle(app.bundle, 'main');
        const { module: configModule } = await loadAppBundle(app.bundle, 'config');
        const { module: localesModule } = await loadAppBundle(app.bundle, 'locales');

        // load locale messages
        localeMessages.value = localesModule.locales;
        console.log('App locale messages:', localeMessages.value ? Object.keys(localeMessages.value) : undefined);

        // create app instance
        appInstance.value = createAppInstance(configModule.config, version);
    } catch (err) {
        error(t('unableToLoadAppBundle', { error: err }));
        hasError.value = true;
        return;
    }

    const assetConfig = asset.value.config;

    if (!assetConfig) {
        // create default model
        model.value = appInstance.value.createConceptInstance(appInstance.value.concept);
    } else {
        const parseResult = z
            .object({
                appVersion: z.string(),
                model: z.unknown(),
            })
            .safeParse(assetConfig);

        if (!parseResult.success) {
            model.value = appInstance.value.createConceptInstance(appInstance.value.concept);
            console.warn('Invalid asset config:', parseResult.error);
            error(t('assetConfigReset'));
        } else {
            const importResult = appInstance.value?.importModel(toRaw(parseResult.data.model) as object);
            if (!importResult.success) {
                error(t('upgradeFailed'));
                console.error(importResult);
                // show the old version
                model.value = appInstance.value.createConceptInstance(appInstance.value.concept);
            } else {
                model.value = importResult.model as inferConcept<typeof appInstance.value.concept>;
                console.log('Loaded app model:', model.value);
                console.log('Model app version:', parseResult.data.appVersion);
            }
        }
        // TODO: model version migration
    }

    validate(model.value);

    if (appContainerEl.value) {
        // appContainerEl.value.innerHTML = '';

        const currentAppEl = appContainerEl.value.querySelector(app.htmlTagName);
        if (currentAppEl) {
            appContainerEl.value.removeChild(currentAppEl);
        }

        console.log('Creating app element:', app.htmlTagName);
        const el = document.createElement(app.htmlTagName);
        el.setAttribute('config', serializeConfig());
        el.setAttribute('edit-selection', '{"id":""}');
        el.addEventListener(SELECTION_CHANGE_EVENT, ((evt: CustomEvent<SelectionData>) => {
            // sync app's selection change to the configurator's selection
            selection.value = evt.detail;
        }) as EventListener);

        // install preview-pane inline editing event handlers
        addInlineEditEventHandlers(
            el,
            () => model.value!,
            onAppChange,
            (onColorChange) => inlineRteEditor.value?.openColorPicker(onColorChange)
        );

        appContainerEl.value.appendChild(el);
        appEl.value = el;
    }
};

watch(
    [asset, userData],
    ([assetValue, userDataValue]) => {
        if (assetValue) {
            initializeApp(assetValue.app);
        }

        if (userDataValue) {
            const permission = userDataValue.permission as UserPermission;
            isJSONEditorPermission.value = !!permission?.jsonEditor;
            isAIPermission.value = !!permission?.ai;
        }
    },
    { immediate: true }
);

watch(selection, (value) => {
    console.log('Selection changed:', value?.concept.name, value?.id);
    appEl.value?.setAttribute('edit-selection', JSON.stringify({ concept: value?.concept.name, id: value?.id }));
});

const onAppChange = (data: BaseConceptModel) => {
    if (!appInstance.value) {
        return;
    }

    console.log('App change:', data);
    model.value = data as inferConcept<typeof appInstance.value.concept>;

    if (model.value && validate(model.value).success) {
        resetFormConfig();
        jsonEditorModel.value = model.value;
        isUnsaved.value = true;
    }
};

const validate = (model: BaseConceptModel) => {
    const validationResult = appInstance.value!.validateModel(model);
    if (!validationResult.success) {
        issues.value = validationResult.issues;
        console.log('Validation issues:', validationResult.issues);
    } else {
        issues.value = [];
    }
    return validationResult;
};

const onSave = async () => {
    if (asset.value && appInstance.value) {
        try {
            await doSaveAsset(asset.value);
            isUnsaved.value = false;
            success(t('saveSuccess'));
        } catch (err) {
            error(t('unableToSave'));
            console.error('Failed to save asset:', err);
        }
    }
};

const handleKeyDown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent the browser's save dialog
        await onSave();
    }
};

const onDelete = async () => {
    if (asset.value) {
        if (await confirmDelete(t('sureToDelete', { name: asset.value.name }))) {
            try {
                await deleteAsset({ where: { id: asset.value.id } });
                success(t('deleteSuccess'));
                navigateTo('/');
            } catch (err) {
                error(t('unableToDelete'));
                console.error('Failed to save asset:', err);
            }
        }
    }
};

const onPublish = async () => {
    if (asset.value) {
        await doSaveAsset(asset.value);

        const existingPublishUrl = asset.value.publishUrl;
        const isOldVersion = existingPublishUrl && !existingPublishUrl.endsWith('latest/index.html');

        try {
            const { data } = await $fetch(`/api/asset/${asset.value.id}/publish`, {
                method: 'POST',
            });
            console.log('Publish response:', data);
            success(t('publishSuccess'));

            if (isOldVersion) {
                //old version
                alert(
                    'If it is already used by any Ptengine Experience, please update that with the latest CodeMode Code and republish',
                    'Update Ptengine CodeMode'
                );
            }
        } catch (err) {
            error(t('unableToPublish'));
            console.error('Failed to publish asset:', err);
        }
    }
};

function getAppBundle(bundle: string, version: string) {
    if (URL.canParse(bundle)) {
        return bundle;
    } else {
        return `https://compnpmcache.ptengine.com/${bundle}@${version}/dist/index.js`;
    }
}

const onPreview = async () => {
    if (!appInstance.value || !model.value || !asset.value) {
        return;
    }

    const bundle = getAppBundle(asset.value.app.bundle, appInstance.value.version);
    // open a new page
    const newWindow = window.open('/preview.html', '_blank')!;

    newWindow!.onload = () => {
        newWindow.postMessage({
            config: serializeConfig(),
            bundle,
            htmlTag: asset.value.app.htmlTagName,
        });
    };
};

const doSaveAsset = (asset: Asset & { app: App }) => {
    if (!appInstance.value || !model.value) {
        return;
    }
    return saveAsset({
        where: { id: asset.id },
        data: {
            config: { appVersion: appInstance.value.version, model: model.value } as Prisma.InputJsonObject,
            appVersion: appInstance.value.version,
        },
    });
};

const onEditNameComplete = async () => {
    if (!asset.value || !editName.value) {
        return;
    }

    await saveAsset({
        where: { id: asset.value.id },
        data: { name: editName.value },
    });

    editName.value = undefined;
};

const resetFormConfig = () => {
    if (appEl.value && appInstance.value && model.value) {
        appEl.value.setAttribute('config', serializeConfig());
    }
};

const goBack = async () => {
    await navigateTo('/');
};

const onNavigateError = (path: EditPathRecord[]) => {
    console.log('Navigate to:', JSON.stringify(path));
    editPath.value = path;
    issuesDropdown.value?.handleClose();
};

const MAX_IMAGE_SIZE_BYTES = 10_000_000; // 10MB

const uploadImage = async (file: File) => {
    if (!asset.value) {
        return undefined;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        error(t('imageSizeCannotExceed', { size: byteSize(MAX_IMAGE_SIZE_BYTES, { precision: 0 }) }));
        return undefined;
    }

    const { data } = await $fetch(`/api/asset/${asset.value.id}/getFileUploadUrl`, {
        method: 'POST',
        body: { contentType: file.type },
    });

    await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    // strip query string from the upload url
    const url = new URL(data.uploadUrl);
    url.search = '';
    return url.toString();
};

const generateModelArgs = ref<ModelGenerationArgs>();
const generateInputKind = ref<'user-input' | 'elaboration'>('user-input');

const aiGenerateHint = computed(() => {
    if (!generateModelArgs.value) {
        return '';
    }
    if (generateInputKind.value === 'user-input') {
        return generateModelArgs.value.userInputHint;
    } else {
        return generateModelArgs.value.modelGenerationHint;
    }
});

const onGenerateModel = (args: ModelGenerationArgs) => {
    console.log('Generate model for:', args);
    aiInput.value = '';
    generateModelArgs.value = args;
    generateInputKind.value = 'user-input';
    aiDialogVisible.value = true;
};

const isAiGenerating = ref(false);

const onAiDialogOpen = () => {
    aiInputEl.value?.focus();
};

const onGenerate = async () => {
    if (!asset.value || !appInstance.value || !aiInput.value) {
        return;
    }

    if (!generateModelArgs.value) {
        return;
    }

    const duration =
        generateInputKind.value === 'user-input'
            ? runtimeConfig.public.aiGeneratingElaborateExpectedTime
            : runtimeConfig.public.aiGeneratingModelExpectedTime;
    const step = 200;

    isAiGenerating.value = true;

    aiTimer = setInterval(() => {
        aiGeneratingProgress.value = Math.round(Math.random() + aiGeneratingProgress.value);

        if (aiGeneratingProgress.value >= 95) {
            if (aiTimer) {
                clearInterval(aiTimer);
            }
        }
    }, duration / step);

    const payload = {
        kind: generateInputKind.value,
        data: aiInput.value,
        currentModel: model.value,
        aspect: generateModelArgs.value.aspect,
    };
    console.log("Calling app's generation with payload:", payload);

    try {
        const { data } = await $fetch(`/api/asset/${asset.value.id}/ai`, {
            method: 'POST',
            body: payload,
        });

        aiGeneratingProgress.value = 100;
        stopAIGenerating();

        console.log('AI generated result:', data);

        if (generateInputKind.value === 'user-input') {
            console.log('Proceeding to elaboration -> model config phase');
            // trim leading and trailing markers
            if (generateModelArgs.value.aspect == 'design') {
                const importResult = appInstance.value?.mergeStyle(data.result as any, model.value as BaseConceptModel);

                if (!importResult.success) {
                    error(t('aiGenerateFailed'));
                    console.error(importResult);
                } else {
                    success(t('aiGenerateSuccess'));
                    aiDialogVisible.value = false;
                    isUnsaved.value = true;
                    model.value = importResult.model;
                    resetFormConfig();
                    appEl?.value?.setAttribute('edit-selection', '{}');
                }
            } else {
                const result = (data.result as string).replace(/^```\n?/, '').replace(/```\n?$/, '');
                aiInput.value = result;
                generateInputKind.value = 'elaboration';
            }
        } else {
            console.log('Importing AI generated model:', data.result);
            const importResult = appInstance.value?.importModel(data.result as unknown as BaseConceptModel);
            if (!importResult.success) {
                error(t('aiGenerateFailed'));
                console.error(importResult);
            } else {
                success(t('aiGenerateSuccess'));
                aiDialogVisible.value = false;
                isUnsaved.value = true;
                model.value = importResult.model;
                resetFormConfig();
                appEl?.value?.setAttribute('edit-selection', '{}');

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        }
    } catch (e) {
        console.error(e);
        error(t('aiGenerateFailed'));
        if (aiTimer) {
            clearInterval(aiTimer);
        }
        aiGeneratingProgress.value = 0;
        isAiGenerating.value = false;
    }
};

const stopAIGenerating = () => {
    isAiGenerating.value = false;

    if (aiTimer) {
        clearInterval(aiTimer);
        aiTimer = null;
    }
    setTimeout(() => {
        aiGeneratingProgress.value = 0;
    }, 1000);
};

const aiDialogClose = (done: () => void) => {
    if (isAiGenerating.value) {
        ElMessageBox.confirm(t('sureToStopAiGeneration'))
            .then(() => {
                stopAIGenerating();
                done();
            })
            .catch(() => {
                // catch error
            });
    } else {
        stopAIGenerating();
        done();
    }
};
watch(isShowJSON, (value) => {
    if (value) {
        jsonEditorModel.value = model.value;
    }
});

const onJsonEditorUpdate = (updatedContent: any) => {
    if (!appInstance.value) {
        return;
    }

    const defaultModel = appInstance.value.createConceptInstance(appInstance.value.concept);

    let parsed;
    try {
        parsed = JSON.parse(updatedContent.text);
    } catch (err) {
        console.error('Invalid JSON content:', err);
        model.value = defaultModel;
    }

    if (parsed) {
        const validationResult = validate(parsed);
        if (validationResult.success) {
            model.value = validationResult.model;
        } else {
            model.value = defaultModel;
        }
    }

    editPath.value = [];
    appEl?.value?.setAttribute('edit-selection', '{}');
    resetFormConfig();
};
</script>

<template>
    <el-container class="flex flex-col gap-4 h-full p-8">
        <!-- header -->
        <div class="flex justify-between">
            <el-page-header @back="goBack">
                <template #content>
                    <div v-if="editName === undefined" class="flex items-center group">
                        <span class="text-large font-600 mr-3"> {{ asset?.name }} </span>
                        <el-icon class="invisible group-hover:visible cursor-pointer" @click="editName = asset?.name">
                            <ElIconEditPen />
                        </el-icon>
                    </div>
                    <div v-else>
                        <el-input
                            ref="editNameEl"
                            v-model="editName"
                            :placeholder="$t('inputAssetName')"
                            @blur="onEditNameComplete"
                            @keyup.enter="onEditNameComplete"
                        />
                    </div>
                </template>
            </el-page-header>

            <div class="flex items-center button-group gap-2">
                <!-- validation issues dropdown -->
                <el-dropdown trigger="click" ref="issuesDropdown" v-if="issues.length > 0 && appInstance && model">
                    <el-icon class="w-4 h-4 cursor-pointer" color="#f09035">
                        <ElIconWarnTriangleFilled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <ValidationIssues
                                class="p-4 text-sm max-w-96"
                                :issues="issues"
                                :concept="appInstance.concept"
                                :model="model"
                                :locale-messages="localeMessages"
                                @navigate="(path: EditPathRecord[]) => onNavigateError(path)"
                            />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button @click="onSave" :disabled="issues.length > 0" v-loading="isSavingAsset">{{
                    $t('save')
                }}</el-button>
                <el-button @click="onDelete" v-loading="isDeletingAsset">{{ $t('delete') }}</el-button>
                <el-button @click="onPreview" :disabled="issues.length > 0" v-loading="isPreviewAsset">{{
                    $t('preview')
                }}</el-button>
                <el-button
                    type="primary"
                    @click="onPublish"
                    :disabled="issues.length > 0"
                    v-loading="isPublishingAsset"
                    >{{ $t('publish') }}</el-button
                >
            </div>
        </div>

        <!-- configurator -->
        <div v-loading="!appInstance && !hasError" class="flex flex-grow overflow-hidden gap-4 w-full">
            <!-- configurator panel -->
            <div class="flex-grow rounded">
                <div class="flex rounded-md shadow-sm mt-1 mb-4 justify-between" role="group">
                    <div>
                        <button
                            @click="
                                () => {
                                    isMobile = true;
                                }
                            "
                            class="px-4 py-2 text-sm border rounded-l-md hover:bg-gray-200 text-gray-900 bg-gray-100 border-gray-200 focus:border-gray-200 focus:bg-gray-500 focus:text-white"
                        >
                            {{ t('mobile') }}
                        </button>
                        <button
                            autofocus
                            @click="
                                () => {
                                    isMobile = false;
                                }
                            "
                            class="px-4 py-2 text-sm border rounded-r-md hover:bg-gray-200 text-gray-900 bg-gray-100 border-gray-200 focus:border-gray-200 focus:bg-gray-500 focus:text-white"
                        >
                            {{ t('desktop') }}
                        </button>
                    </div>
                    <div v-if="isJSONEditorPermission" class="flex items-center gap-1 self-end">
                        <span>JSON</span>
                        <el-switch v-model="isShowJSON"> </el-switch>
                    </div>
                </div>

                <div
                    ref="appContainerEl"
                    id="haya-app-container"
                    class="overflow-auto ml-auto mr-auto relative"
                    :class="[isMobile ? 'w-[375px]' : 'w-full', isShowJSON ? 'h-1/2' : 'h-3/4']"
                >
                    <!-- InlineRteEditor owns a ElColorPicker which has a trigger button that
                we don't want to display, but would put it around the center of the pane so the 
                color picker popover shows close to the center -->
                    <div class="invisible absolute inset-1/3">
                        <InlineRteEditor ref="inlineRteEditor" />
                    </div>
                </div>

                <div v-if="isShowJSON" class="bottom-tabs overflow-auto w-full h-2/5">
                    <JsonEditorVue
                        :modelValue="jsonEditorModel"
                        :mode="Mode.text"
                        :stringified="false"
                        :onChange="onJsonEditorUpdate"
                    />
                </div>
            </div>
            <!-- preview -->
            <div class="w-[400px] shrink-0 border rounded block overflow-clip" v-if="appInstance">
                <div :class="isAIPermission ? 'h-[calc(100%-4rem)]' : 'h-full'">
                    <AppConfigurator
                        :app="appInstance"
                        :model="model"
                        :locale-messages="localeMessages"
                        v-model:editPath="editPath"
                        v-model:selection="selection"
                        :image-uploader="uploadImage"
                        :predefined-colors="PredefinedColors"
                        @change="onAppChange"
                        @generate-model="onGenerateModel"
                    />
                </div>
            </div>
        </div>
    </el-container>

    <el-dialog
        :title="$t(`aiGenerate-${generateModelArgs?.aspect}`)"
        v-model="aiDialogVisible"
        @opened="onAiDialogOpen"
        :before-close="aiDialogClose"
        style="border-radius: 0.5rem"
    >
        <div class="flex bg-gray-100 px-4 pt-4 rounded-lg justify-between mb-2">
            <p class="text-gray-700 mb-2"><Markdown :value="aiGenerateHint" /></p>
            <div className="w-[100px] h-[100px] self-end">
                <img src="/img/ai_assistant.png" alt="ai" className="object-contain w-full h-full" />
            </div>
        </div>

        <el-input
            type="textarea"
            v-model="aiInput"
            :rows="10"
            :placeholder="$t('inputRequirements')"
            class="mb-4"
            ref="aiInputEl"
        ></el-input>

        <div class="inline-block w-full relative">
            <el-button class="w-full" type="primary" :disabled="isAiGenerating" @click="onGenerate"
                ><span class="z-10">{{
                    generateModelArgs?.aspect === 'design'
                        ? $t('generateDesign')
                        : generateInputKind === 'user-input'
                        ? $t('generateContentPlan')
                        : $t('generateForm')
                }}</span></el-button
            >
            <span class="inline">
                <span
                    class="bg-blue-500 rounded absolute h-full left-0"
                    :style="{ width: aiGeneratingProgress + '%' }"
                ></span>
            </span>
        </div>
    </el-dialog>
</template>

<style scoped>
.button-group button {
    @apply w-24;
    @apply ml-0;
}
</style>

<style>
#haya-app-container .el-color-picker__panel {
    /* make sure the color picker panel shows on the top */
    z-index: 100000 !important;
}
</style>
