<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { ref } from 'vue';
import Configurator from './components/App.vue';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { FormApp } from './test-config/supa-form';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);

const onAppChange = (data: BaseConceptModel) => {
    app.model = model.value = data as typeof app.model;
};
</script>

<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col gap-8 justify-center items-center flex-grow w-full h-full px-4 py-16"
        >
            <div class="text-2xl text-slate-500">App Preview</div>
            <div class="border rounded bg-cyan-50 w-full h-1/2"></div>
            <div class="w-full h-1/2 overflow-auto border rounded">
                <JsonViewer
                    :value="model"
                    expanded
                    :expandDepth="10"
                    copyable
                    class="h-full"
                />
            </div>
        </div>
        <div class="w-[480px] border rounded h-full">
            <Configurator :app="app" :model="model" @change="onAppChange" />
        </div>
    </div>
</template>
