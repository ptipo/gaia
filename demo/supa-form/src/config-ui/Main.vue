<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { AppConfigurator, ValidationIssues, type EditPathRecord, type Issue } from '@gaia/configurator-vue';
import '@gaia/configurator-vue/dist/index.css';
import { onMounted, ref } from 'vue';
import { ElNotification } from 'element-plus';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { FormApp } from '../config';
import type { EditPathRecord } from '@gaia/configurator';

// form app
const app = createAppInstance(FormApp);

// form model
const model = ref<BaseConceptModel>(app.model);

// current edit path in the configurator
const currentPath = ref<EditPathRecord[]>([{ parentKey: [], concept: app.concept }]);

// validation issues
const issues = ref<Issue[]>([]);

// form element
const formEl = ref<HTMLElement>();

const onAppChange = (data: BaseConceptModel) => {
    app.model = data as typeof app.model;
    model.value = data;
    validate(model.value);
    resetFormConfig();
};

function onReset() {
    const form = document.getElementById('pt-form') as HTMLElement;
    const parent = form.parentElement!;
    parent.removeChild(form);
    parent.innerHTML = `<pt-form id="pt-form" config=${app.stringifyModel(model.value)} ></pt-form>`;
}

onMounted(async () => {
    validate(model.value);
    document.addEventListener('pt-form-submit', function (event: any) {
        alert(`form submit data:${JSON.stringify(event.detail, null, 2)}`);
    });
    resetFormConfig();
});

const resetFormConfig = () => {
    formEl?.value?.setAttribute('config', app.stringifyModel(model.value));
};

const onSave = () => {
    localStorage.setItem('gaia-app-config', app.stringifyModel(model.value));
    ElNotification({
        title: 'Configuration saved',
        type: 'success',
        duration: 2000,
    });
};

const onLoad = () => {
    const data = localStorage.getItem('gaia-app-config');
    if (data) {
        model.value = app.loadModel(data);
        ElNotification({
            title: 'Configuration loaded',
            type: 'success',
            duration: 2000,
        });
        resetFormConfig();
    } else {
        ElNotification({
            title: 'No configuration found',
            type: 'error',
            duration: 2000,
        });
    }
};

const onNavigateError = (path: EditPathRecord[]) => {
    currentPath.value = path;
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
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col gap-4 justify-center items-center flex-grow w-full h-full p-4">
            <div class="text-2xl text-slate-500">Supa Form Builder</div>
            <div class="flex self-start">
                <el-button @click="onSave">Save</el-button>
                <el-button @click="onLoad">Load</el-button>
                <el-button @click="onReset"> Reset </el-button>
            </div>
            <div class="border rounded bg-cyan-50 w-full flex-grow overflow-auto">
                <pt-form id="pt-form" ref="formEl"></pt-form>
            </div>
            <el-tabs class="w-full h-1/2">
                <el-tab-pane label="Json">
                    <div class="overflow-auto border rounded">
                        <JsonViewer :value="model" expanded :expandDepth="10" copyable class="h-full" />
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`Issues (${issues.length})`">
                    <div class="h-full border rounded">
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
        <div class="w-[480px] border rounded h-full">
            <AppConfigurator :app="app" :model="model" v-model:currentPath="currentPath" @change="onAppChange" />
        </div>
    </div>
</template>

<style>
.el-tab-pane {
    height: 100%;
}

.el-tabs {
    display: flex;
    flex-direction: column;
}

.el-tabs__content {
    flex: 1;
    overflow: auto;
}
</style>
