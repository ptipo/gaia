<script lang="ts" setup>
import type { AppInstance, Concept, ValidationIssue } from '@hayadev/configurator';
import { createAppInstance, type BaseConceptModel } from '@hayadev/configurator';
import { AppConfigurator, ValidationIssues, type EditPathRecord, type SelectionData } from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import type { App, Asset } from '@prisma/client';
import type { DropdownInstance } from 'element-plus';
import { useDeleteAsset, useFindUniqueAsset, useUpdateAsset } from '~/composables/data';
import { loadAppBundle } from '~/lib/app';
import { confirmDelete, error, success } from '~/lib/message';

const route = useRoute();

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

const isMobile = ref(false);

const { data: asset } = useFindUniqueAsset({
    where: { id: route.params.id as string },
    include: { app: true },
});

const { mutateAsync: saveAsset, isPending: isSavingAsset } = useUpdateAsset();
const { mutateAsync: deleteAsset, isPending: isDeletingAsset } = useDeleteAsset();

const createAppElement = async (app: App) => {
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
        return;
    }

    try {
        console.log('Loading app bundle from:', app.bundle);
        const { module, version } = await loadAppBundle(app.bundle);

        if (!module.config) {
            console.error('No config found in the app bundle.');
            return;
        }

        appInstance.value = createAppInstance(module.config, version);
        model.value = appInstance.value.model;
    } catch (err) {
        error(`Failed to load app bundle: ${err}`);
        hasError.value = true;
        return;
    }

    if (asset.value?.config) {
        const {
            model: loadedModel,
            appVersion,
            error: loadError,
        } = appInstance.value.loadModel(JSON.stringify(asset.value.config));

        if (loadError) {
            console.warn('Error loading app model:', loadError.message);
            error('资产配置格式不正确，已恢复为默认配置。详情请查看浏览器控制台。');
        } else {
            model.value = loadedModel;
            console.log('Loaded app model:', model.value);
            console.log('Model app version:', appVersion);
        }
    }

    if (model.value) {
        // trigger an initial validation
        validate(model.value);

        if (appContainerEl.value) {
            appContainerEl.value.innerHTML = '';
            console.log('Creating app element:', app.htmlTagName);
            const el = document.createElement(app.htmlTagName);
            el.setAttribute('config', appInstance.value.stringifyModel(model.value));
            el.setAttribute('edit-selection', '{"id":""}');
            appContainerEl.value.appendChild(el);
            appEl.value = el;
        }
    }
};

watch(
    asset,
    (value) => {
        if (value) {
            createAppElement(value.app);
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
    appInstance.value.model = model.value = data as typeof appInstance.value.model;

    if (validate(model.value)) {
        resetFormConfig();
    }
};

const validate = (model: BaseConceptModel) => {
    if (!appInstance.value) {
        return;
    }

    const validationResult = appInstance.value.validateModel(model);
    if (!validationResult.success) {
        issues.value = validationResult.issues;
        console.log('Validation issues:', validationResult.issues);
        return false;
    } else {
        issues.value = [];
        return true;
    }
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
            const { data } = await $fetch('/api/publish', {
                method: 'POST',
                body: JSON.stringify({ id: asset.value.id }),
            });
            console.log('Publish response:', data);
            success('发布成功！');
        } catch (err) {
            error(`暂时无法发布，请稍后再试`);
            console.error('Failed to publish asset:', err);
        }
    }
};

const doSaveAsset = (asset: Asset & { app: App }) => {
    if (!appInstance.value || !model.value) {
        return;
    }
    const serializedModel = appInstance.value.stringifyModel(model.value);
    return saveAsset({
        where: { id: asset.id },
        data: {
            config: JSON.parse(serializedModel),
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
        appEl.value.setAttribute('config', appInstance.value.stringifyModel(model.value));
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
</script>

<template>
    <el-container class="flex flex-col gap-4 h-full p-8">
        <!-- header -->
        <div class="flex justify-between">
            <el-page-header @back="goBack">
                <template #content>
                    <div v-if="editName === undefined" class="flex items-center group">
                        <span class="text-large font-600 mr-3"> {{ asset?.name }} </span>
                        <el-icon class="invisible group-hover:visible cursor-pointer" @click="editName = asset?.name"
                            ><ElIconEditPen
                        /></el-icon>
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
                    <el-icon class="w-4 h-4 cursor-pointer" color="#f09035"><ElIconWarnTriangleFilled /></el-icon>
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
                <el-button type="primary" @click="onPublish" :disabled="issues.length > 0" v-loading="isPublishingAsset"
                    >发布</el-button
                >
            </div>
        </div>

        <!-- configurator -->
        <div v-loading="!appInstance && !hasError" class="flex flex-grow overflow-hidden gap-4 w-full">
            <!-- configurator panel -->
            <div class="flex-grow rounded">
                <div class="rounded-md shadow-sm mt-1 mb-4" role="group">
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

                <div
                    ref="appContainerEl"
                    class="h-3/4 overflow-auto ml-auto mr-auto"
                    :class="isMobile ? 'w-[375px]' : 'w-full'"
                ></div>
            </div>
            <!-- preview -->
            <div class="w-80 border rounded" v-if="appInstance">
                <AppConfigurator
                    :app="appInstance"
                    :model="model"
                    v-model:editPath="editPath"
                    v-model:selection="selection"
                    @change="onAppChange"
                />
            </div>
        </div>
    </el-container>
</template>

<style scoped>
.button-group button {
    @apply w-24;
    @apply ml-0;
}
</style>
