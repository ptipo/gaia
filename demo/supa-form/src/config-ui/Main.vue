<script setup lang="ts">
import { BaseConceptModel, createAppInstance, ValidationIssue } from '@hayadev/configurator';
import {
    addInlineEditEventHandlers,
    AppConfigurator,
    ValidationIssues,
    type EditPathRecord,
    type SelectionData,
} from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import { ColorPickerInstance, ElNotification } from 'element-plus';
import JsonEditorVue from 'json-editor-vue';
import { onMounted, ref, watch } from 'vue';
import pkgJson from '../../package.json';
import { config as FormApp } from '../config';
import { locales } from '../locales';

// form app
const app = createAppInstance(FormApp, pkgJson.version);

// form model
const model = ref<BaseConceptModel>(app.createConceptInstance(app.concept));

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
    model.value = data;
    validate(model.value);
    resetFormConfig();

    const jsonEditor = jsonEditorVueRef.value.jsonEditor;
    jsonEditor.set({ json: model.value });
};

onMounted(async () => {
    validate(model.value);
    document.addEventListener('pt-form-submit', function (event: any) {
        alert(`form submit data:${JSON.stringify(event.detail, null, 2)}`);
    });
    resetFormConfig();
    onLoad(false);

    if (formEl.value) {
        addInlineEditEventHandlers(formEl.value, () => model.value, onAppChange, onOpenColorPicker);
    }
});

const resetFormConfig = () => {
    formEl?.value?.setAttribute('config', JSON.stringify({ appVersion: app.version, model: model.value }));
};

const onSave = () => {
    localStorage.setItem('haya-app-config', JSON.stringify({ appVersion: app.version, model: model.value }));
    ElNotification({
        title: 'Configuration saved',
        type: 'success',
        duration: 2000,
    });
};

const onLoad = (reportError = true) => {
    const data = localStorage.getItem('haya-app-config');
    if (data) {
        const { appVersion, model: loadedModel } = JSON.parse(data);
        model.value = loadedModel;
        const validationResult = validate(loadedModel);

        if (!validationResult.success) {
            ElNotification({
                title: 'Configuration loaded with validation issues',
                type: 'error',
                duration: 2000,
            });
        } else {
            ElNotification({
                title: `Configuration loaded (v${appVersion})`,
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
        newWindow.postMessage({ ptForm: JSON.stringify({ appVersion: app.version, model: model.value }) });
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
    return validationResult;
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

const pickedColor = ref('');
const colorPicker = ref<ColorPickerInstance>();

const onOpenColorPicker = () => {
    colorPicker.value?.show();
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
                class="border rounded bg-white h-full flex-grow overflow-auto flex flex-col"
                :class="isMobile ? 'w-[375px]' : 'w-full'"
            >
                <el-color-picker
                    v-model="pickedColor"
                    show-alpha
                    ref="colorPicker"
                    class="m-auto invisible"
                ></el-color-picker>
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
                                            model = jsonModel;
                                            validate(model);
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
                :locale-messages="locales"
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
