<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { config as FormApp } from '@gaia/samples/form';
import { ref } from 'vue';
import Configurator from './components/App.vue';
import { ElNotification } from 'element-plus';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);

const onAppChange = (data: BaseConceptModel) => {
    app.model = data as typeof app.model;
    model.value = data;
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
            <div class="text-2xl text-slate-500">Configuration Preview</div>
            <div class="flex self-start">
                <el-button @click="onSave">Save</el-button>
                <el-button @click="onLoad">Load</el-button>
            </div>
            <div class="flex-grow w-full overflow-auto border rounded">
                <JsonViewer :value="model" expanded :expandDepth="10" copyable class="h-full" />
            </div>
        </div>
        <div class="w-[480px] border rounded h-full">
            <Configurator :app="app" :model="model" @change="onAppChange" />
        </div>
    </div>
</template>
