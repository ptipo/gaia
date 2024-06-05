<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { ref, onMounted } from 'vue';
import Configurator from './components/App.vue';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { config as FormApp } from '@gaia/samples/form';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col gap-8 justify-center items-center flex-grow w-full h-full p-4">
            <div class="text-2xl text-slate-500">Configuration Preview</div>
            <div class="flex-grow w-full overflow-auto border rounded">
                <JsonViewer :value="model" expanded :expandDepth="10" copyable class="h-full" />
            </div>
        </div>
        <div class="w-[480px] border rounded h-full">
            <Configurator :app="app" :model="model" @change="onAppChange" />
        </div>
    </div>
</template>
