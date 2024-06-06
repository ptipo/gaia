<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { AppConfigurator } from '@gaia/configurator-vue';
import '@gaia/configurator-vue/dist/index.css';
import { ref, onMounted } from 'vue';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { FormApp } from '../config';
import { ElNotification } from 'element-plus';
import type { EditPathRecord } from '@gaia/configurator';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);
const currentPath = ref<EditPathRecord[]>([{ parentKey: [], concept: app.concept }]);
const formEl = ref<HTMLElement>();

const onAppChange = (data: BaseConceptModel) => {
    app.model = data as typeof app.model;
    model.value = data;
    resetFormConfig();
};

function onReset() {
    const form = document.getElementById('pt-form') as HTMLElement;
    const parent = form.parentElement!;
    parent.removeChild(form);
    parent.innerHTML = `<pt-form id="pt-form" config=${app.stringifyModel(model.value)} ></pt-form>`;
}

onMounted(async () => {
    document.addEventListener('pt-form-submit', function (event: any) {
        alert(`form submit data:${JSON.stringify(event.detail, null, 2)}`);
    });
    resetFormConfig();
});

const resetFormConfig = () => {
    formEl?.value.setAttribute('config', app.stringifyModel(model.value));
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
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col gap-4 justify-center items-center flex-grow w-full h-full p-4">
            <div class="text-2xl text-slate-500">Supa Form Builder</div>
            <div class="flex self-start">
                <el-button @click="onSave">Save</el-button>
                <el-button @click="onLoad">Load</el-button>
            </div>
            <div class="border rounded bg-cyan-50 w-full h-1/2 overflow-auto">
                <pt-form id="pt-form" ref="formEl"></pt-form>
            </div>
            <button
                type="button"
                @click="onReset"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                Reset
            </button>
            <div class="w-full h-1/2 overflow-auto border rounded">
                <JsonViewer :value="model" expanded :expandDepth="10" copyable class="h-full" />
            </div>
        </div>
        <div class="w-[480px] border rounded h-full">
            <AppConfigurator :app="app" :model="model" v-model:currentPath="currentPath" @change="onAppChange" />
        </div>
    </div>
</template>
