<script lang="ts" setup>
import type { AppInstance, Concept, inferConcept } from '@hayadev/configurator';
import {
    createAppInstance,
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
} from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import type { App, Asset, Prisma } from '@prisma/client';
import byteSize from 'byte-size';
import type { DropdownInstance } from 'element-plus';
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';
import { z } from 'zod';
import { useDeleteAsset, useFindUniqueAsset, useFindUniqueUser, useUpdateAsset } from '~/composables/data';
import { loadAppBundle } from '~/lib/app';
import { confirmDelete, error, success } from '~/lib/message';

const route = useRoute();

const user = useUser();

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

watch([asset, isLoading], ([assetValue, isLoadingValue]) => {
    if (!isLoadingValue && assetValue === null) {
        console.error('Asset not found:', route.params.id);
        throw createError({
            statusCode: 404,
            statusMessage: '指定的资产不存在',
            fatal: true,
        });
    }
});

watch(loadError, (value) => {
    if (value) {
        console.error('Failed to load asset:', value);
        error(`无法加载资产`);
        navigateTo('/');
    }
});

const { mutateAsync: saveAsset, isPending: isSavingAsset } = useUpdateAsset();
const { mutateAsync: deleteAsset, isPending: isDeletingAsset } = useDeleteAsset();

const serializeConfig = () => JSON.stringify({ appVersion: appInstance.value?.version, model: model.value });

const initializeApp = async (app: App) => {
    if (appEl.value) {
        // already created
        return;
    }

    if (!asset.value) {
        // asset not ready
        return;
    }

    if (!asset.value.config) {
        console.error('No config found in the asset.');
        error('资产配置不存在');
        return;
    }

    if (!app.bundle) {
        console.error('No bundle found in the app instance.');
        error('无法加载资产应用');
        return;
    }

    try {
        console.log('Loading app bundle from:', app.bundle);
        const { module, version } = await loadAppBundle(app.bundle);

        if (!module.config) {
            console.error('No config found in the app bundle.');
            return;
        }

        // create app instance
        appInstance.value = createAppInstance(module.config, version);
    } catch (err) {
        error(`Failed to load app bundle: ${err}`);
        hasError.value = true;
        return;
    }

    const parseResult = z
        .object({
            appVersion: z.string(),
            model: z.unknown(),
        })
        .safeParse(asset.value.config);

    if (!parseResult.success) {
        model.value = appInstance.value.createConceptInstance(appInstance.value.concept);
        console.warn('Invalid asset config:', parseResult.error);
        error('资产配置格式不正确，已恢复为默认配置。详情请查看浏览器控制台。');
    } else {
        model.value = parseResult.data.model as inferConcept<typeof appInstance.value.concept>;
        console.log('Loaded app model:', model.value);
        console.log('Model app version:', parseResult.data.appVersion);
    }

    // TODO: model version migration
    validate(model.value);

    if (appContainerEl.value) {
        appContainerEl.value.innerHTML = '';
        console.log('Creating app element:', app.htmlTagName);
        const el = document.createElement(app.htmlTagName);
        el.setAttribute('config', serializeConfig());
        el.setAttribute('edit-selection', '{"id":""}');
        el.addEventListener(SELECTION_CHANGE_EVENT, ((evt: CustomEvent<SelectionData>) => {
            // sync app's selection change to the configurator's selection
            selection.value = evt.detail;
        }) as EventListener);

        // install preview-pane inline editing event handlers
        addInlineEditEventHandlers(el, () => model.value!, onAppChange);

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
            isAIPermission.value = !!permission.ai;
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
            success('保存成功！');
        } catch (err) {
            error(`暂时无法保存，请稍后再试`);
            console.error('Failed to save asset:', err);
        }
    }
};

const onDelete = async () => {
    if (asset.value) {
        if (await confirmDelete(`确定要删除资产 "${asset.value.name}" 吗？`)) {
            try {
                await deleteAsset({ where: { id: asset.value.id } });
                success('删除成功！');
                navigateTo('/');
            } catch (err) {
                error(`暂时无法删除，请稍后再试`);
                console.error('Failed to save asset:', err);
            }
        }
    }
};

const onPublish = async () => {
    if (asset.value) {
        await doSaveAsset(asset.value);

        try {
            const { data } = await $fetch(`/api/asset/${asset.value.id}/publish`, {
                method: 'POST',
            });
            console.log('Publish response:', data);
            success('发布成功！');
        } catch (err) {
            error(`暂时无法发布，请稍后再试`);
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
        error(`图片大小不能超过${byteSize(MAX_IMAGE_SIZE_BYTES, { precision: 0 })}`);
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

const isAiGenerating = ref(false);

const onAiDialogOpen = () => {
    aiInputEl.value?.focus();
};

const onGenerate = async () => {
    if (!asset.value || !appInstance.value) {
        return undefined;
    }

    isAiGenerating.value = true;
    const { data } = await $fetch(`/api/asset/${asset.value.id}/ai`, {
        method: 'POST',
        body: { prompt: aiInput.value },
    });
    isAiGenerating.value = false;
    console.log('AI generation response:', data);

    const importResult = appInstance.value?.importModel(data.json);
    if (!importResult.success) {
        error(`生成有误，请重新生成`);
        console.error(importResult);
    } else {
        success('生成成功');
        aiDialogVisible.value = false;
        model.value = importResult.model;
        resetFormConfig();
        appEl?.value?.setAttribute('edit-selection', '{}');
    }
};

const aiDialogClose = (done: () => void) => {
    if (isAiGenerating.value) {
        ElMessageBox.confirm('还在生成中，确定要关闭吗？')
            .then(() => {
                isAiGenerating.value = false;
                done();
            })
            .catch(() => {
                // catch error
            });
    } else {
        isAiGenerating.value = false;
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
                            placeholder="请输入资产名称"
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
                                @navigate="(path: EditPathRecord[]) => onNavigateError(path)"
                            />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button @click="onSave" :disabled="issues.length > 0" v-loading="isSavingAsset">保存</el-button>
                <el-button @click="onDelete" v-loading="isDeletingAsset">删除</el-button>
                <el-button @click="onPreview" :disabled="issues.length > 0" v-loading="isPreviewAsset">预览</el-button>
                <el-button type="primary" @click="onPublish" :disabled="issues.length > 0" v-loading="isPublishingAsset"
                    >发布</el-button
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
                            Mobile
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
                            Desktop
                        </button>
                    </div>
                    <div v-if="isJSONEditorPermission" class="flex items-center gap-1 self-end">
                        <span>JSON</span>
                        <el-switch v-model="isShowJSON"> </el-switch>
                    </div>
                </div>

                <div
                    ref="appContainerEl"
                    class="overflow-auto ml-auto mr-auto"
                    :class="[isMobile ? 'w-[375px]' : 'w-full', isShowJSON ? 'h-1/2' : 'h-3/4']"
                ></div>
                <div v-if="isShowJSON" class="bottom-tabs overflow-auto w-full h-1/2">
                    <JsonEditorVue
                        :modelValue="jsonEditorModel"
                        :mode="Mode.text"
                        :stringified="false"
                        :onChange="onJsonEditorUpdate"
                    />
                </div>
            </div>
            <!-- preview -->
            <div class="w-[400px] shrink-0 border rounded block overflow-hidden" v-if="appInstance">
                <div class="w-full mt-1 flex justify-center p-4" v-if="isAIPermission">
                    <el-button class="w-full pt-4" @click="aiDialogVisible = true">AI 生成表单</el-button>
                </div>
                <AppConfigurator
                    :app="appInstance"
                    :model="model"
                    v-model:editPath="editPath"
                    v-model:selection="selection"
                    :image-uploader="uploadImage"
                    @change="onAppChange"
                />
            </div>
        </div>
    </el-container>

    <el-dialog
        title="AI生成表单"
        v-model="aiDialogVisible"
        @opened="onAiDialogOpen"
        :before-close="aiDialogClose"
        style="border-radius: 0.5rem"
    >
        <div class="flex bg-gray-100 px-4 pt-4 rounded-lg justify-between mb-2">
            <div>
                <p class="text-gray-700 mb-2">我可以帮您快速生成表单或问卷，您可以</p>

                <ol class="list-decimal list-inside text-gray-600 mb-2">
                    <li>告诉我您的调研目的和对象</li>
                    <li>或直接给我问题和选项</li>
                </ol>
                <p class="text-gray-700 mb-2">我将立即为您生成表单</p>
            </div>
            <div className="w-[100px] h-[100px] self-end">
                <img src="/img/ai_assistant.png" alt="ai" className="object-contain w-full h-full" />
            </div>
        </div>

        <el-input
            type="textarea"
            v-model="aiInput"
            :rows="10"
            placeholder="请输入您的需求..."
            class="mb-4"
            ref="aiInputEl"
        ></el-input>

        <el-button
            type="primary"
            class="w-full bg-teal-800 hover:bg-teal-900"
            v-loading="isAiGenerating"
            @click="onGenerate"
        >
            <i class="el-icon-plus mr-2"></i>
            生成表单
        </el-button>
    </el-dialog>
</template>

<style scoped>
.button-group button {
    @apply w-24;
    @apply ml-0;
}
</style>
