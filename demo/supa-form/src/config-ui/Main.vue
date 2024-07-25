<script setup lang="ts">
import { BaseConceptModel, createAppInstance, ValidationIssue } from '@hayadev/configurator';
import { AppConfigurator, ValidationIssues, type EditPathRecord, type SelectionData } from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import { ElNotification } from 'element-plus';
import { nextTick, onMounted, ref, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue';
import pkgJson from '../../package.json';
import { FormApp } from '../config';

// form app
const app = createAppInstance(FormApp, pkgJson.version);

// form model
const model = ref<BaseConceptModel>(app.model);

// current edit path in the configurator
const editPath = ref<EditPathRecord[]>([]);

// current selected concept instance
const selection = ref<SelectionData>();

// validation issues
const issues = ref<ValidationIssue[]>([]);

// form element
const formEl = ref<HTMLElement>();

const jsonEditorVueRef = ref();

const isMobile = ref(false);

const onAppChange = async (data: BaseConceptModel) => {
    app.model = data as typeof app.model;
    model.value = data;
    validate(model.value);
    resetFormConfig();

    const jsonEditor = jsonEditorVueRef.value.jsonEditor;

    await jsonEditor.update(model.value);
};

onMounted(async () => {
    validate(model.value);
    document.addEventListener('pt-form-submit', function (event: any) {
        alert(`form submit data:${JSON.stringify(event.detail, null, 2)}`);
    });
    resetFormConfig();
    onLoad(false);
});

const resetFormConfig = () => {
    formEl?.value?.setAttribute('config', app.stringifyModel(model.value));
};

const onSave = () => {
    localStorage.setItem('haya-app-config', app.stringifyModel(model.value));
    ElNotification({
        title: 'Configuration saved',
        type: 'success',
        duration: 2000,
    });
};

const onLoad = (reportError = true) => {
    const data = localStorage.getItem('haya-app-config');
    if (data) {
        const loaded = app.loadModel(data);
        if (loaded.error) {
            ElNotification({
                title: 'Configuration loaded with validation issues',
                type: 'error',
                duration: 2000,
            });
        } else {
            model.value = loaded.model;
            ElNotification({
                title: `Configuration loaded (v${loaded.appVersion})`,
                type: 'success',
                duration: 2000,
            });
            resetFormConfig();
        }
    } else if (reportError) {
        ElNotification({
            title: 'No configuration found',
            type: 'error',
            duration: 2000,
        });
    }
};

const onPreview = () => {
    // open a new page
    const newWindow = window.open('./preview.html', '_blank')!;

    newWindow.onload = () => {
        newWindow.postMessage({ ptForm: app.stringifyModel(model.value) });
    };
};

const onNavigateError = (path: EditPathRecord[]) => {
    console.log('Navigate to:', JSON.stringify(path));
    editPath.value = path;
};

const validate = (model: BaseConceptModel) => {
    const validationResult = app.validateModel(model);
    if (!validationResult.success) {
        issues.value = validationResult.issues;
        console.log('Validation issues:', validationResult.issues);
    } else {
        issues.value = [];
    }
};

watch(selection, (value) => {
    console.log('Selection changed:', value?.concept.name, value?.id);

    formEl.value?.setAttribute('edit-selection', JSON.stringify({ concept: value?.concept.name, id: value?.id }));
});

const uploadImage = async (file: File) => {
    const blob = new Blob([await file.arrayBuffer()], {
        type: file.type,
    });
    const url = URL.createObjectURL(blob);
    return url;
};
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col gap-4 justify-center items-center flex-grow w-full h-full px-4">
            <div class="text-2xl text-slate-500 mt-4">Supa Form Builder</div>
            <div class="flex self-start">
                <el-button @click="onSave">Save</el-button>
                <el-button @click="() => onLoad()">Load</el-button>
                <el-button @click="onPreview">Preview</el-button>
                <el-button
                    @click="
                        () => {
                            isMobile = !isMobile;
                        }
                    "
                    >{{ isMobile ? 'Mobile' : 'Desktop' }}</el-button
                >
            </div>
            <div
                class="border rounded bg-white h-full flex-grow overflow-auto"
                :class="isMobile ? 'w-[375px]' : 'w-full'"
            >
                <pt-form id="pt-form" edit-selection='{"id":""}' ref="formEl"></pt-form>
            </div>
            <div class="bottom-tabs w-full h-1/2">
                <el-tabs class="h-full">
                    <el-tab-pane label="Json">
                        <div class="overflow-auto border rounded h-full">
                            <JsonEditorVue
                                ref="jsonEditorVueRef"
                                :modelValue="model"
                                mode="text"
                                :stringified="false"
                                :onChange="
                                    (updatedContent) => {
                                        let jsonModel;
                                        try {
                                            jsonModel = JSON.parse(updatedContent.text);
                                        } catch {}

                                        if (jsonModel) {
                                            const appModel = { model: jsonModel, appVersion: app.version };
                                            const loaded = app.loadModel(JSON.stringify(appModel));
                                            model = loaded.model;
                                            resetFormConfig();
                                        }
                                    }
                                "
                            />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`Issues (${issues.length})`">
                        <div class="h-full border rounded text-red-600 text-sm p-4">
                            <ValidationIssues
                                v-if="issues.length > 0"
                                :issues="issues"
                                :concept="app.concept"
                                :model="model"
                                @navigate="(path: EditPathRecord[]) => onNavigateError(path)"
                            />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="w-[400px] border rounded h-full shrink-0">
            <AppConfigurator
                :app="app"
                :model="model"
                v-model:editPath="editPath"
                v-model:selection="selection"
                :image-uploader="uploadImage"
                @change="onAppChange"
            />
        </div>
    </div>
</template>

<style scoped>
.bottom-tabs .el-tab-pane {
    height: 100%;
}

.bottom-tabs .el-tabs {
    display: flex;
    flex-direction: column;
}

.bottom-tabs .el-tabs__content {
    flex: 1;
    overflow: auto;
}
</style>
