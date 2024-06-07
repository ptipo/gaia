<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { config as FormApp } from '@gaia/samples/form';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import AppConfigurator from './components/AppConfigurator.vue';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import ValidationIssues, { Issue } from './components/ValidationIssues.vue';
import type { EditPathRecord } from './components/types';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);
const issues = ref<Issue[]>([]);
const currentPath = ref<EditPathRecord[]>([{ parentKey: [], concept: app.concept }]);

onMounted(() => {
    validate(model.value);
});

const onAppChange = (data: BaseConceptModel) => {
    app.model = data as typeof app.model;
    model.value = data;
    validate(data);
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
        validate(model.value);
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

const onNavigateError = (path: EditPathRecord[]) => {
    console.log(
        'Navigate to:',
        JSON.stringify(
            path.map((item) => ({ parentKey: item.parentKey, concept: item.concept.name })),
            null,
            2
        )
    );
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
    <div class="flex w-full h-full p-4 gap-4">
        <div class="flex flex-col gap-4 justify-center items-center flex-grow w-full h-full">
            <div class="text-2xl text-slate-500">Configuration Preview</div>
            <div class="flex self-start">
                <el-button @click="onSave">Save</el-button>
                <el-button @click="onLoad">Load</el-button>
            </div>
            <div class="flex-grow w-full overflow-auto border rounded">
                <JsonViewer :value="model" expanded :expandDepth="10" copyable class="h-full" />
            </div>
            <div class="flex flex-col w-full h-1/5 flex-shrink-0">
                <p class="text-gray-600 mb-2">Validation issues</p>
                <div class="border rounded w-full flex-grow">
                    <ValidationIssues
                        v-if="issues.length > 0"
                        :issues="issues"
                        :concept="app.concept"
                        :model="model"
                        @navigate="(path: EditPathRecord[]) => onNavigateError(path)"
                    />
                </div>
            </div>
        </div>
        <div class="w-[480px] border rounded h-full">
            <AppConfigurator :app="app" :model="model" v-model:currentPath="currentPath" @change="onAppChange" />
        </div>
    </div>
</template>
