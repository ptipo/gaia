<script setup lang="ts">
import { ref } from 'vue';
import Configurator from './components/App.vue';
import { app } from './test-config/starter/index';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import type { BaseConceptModel } from '@gaia/configurator';

const model = ref<BaseConceptModel>(app.createModel());

const onModelChange = (newModel: BaseConceptModel) => {
    model.value = newModel;
};
</script>

<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col gap-8 justify-center items-center flex-grow w-full h-full px-4 py-16"
        >
            <div class="text-2xl text-slate-500">App Preview</div>
            <div class="border rounded bg-cyan-50 w-full flex-grow"></div>
            <div class="w-full">
                <JsonViewer :value="model" boxed copyable />
            </div>
        </div>
        <div class="w-96 border rounded">
            <Configurator
                :app="app"
                :model="model"
                @change="(model) => onModelChange(model)"
            />
        </div>
    </div>
</template>
