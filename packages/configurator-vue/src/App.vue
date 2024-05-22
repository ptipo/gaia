<script setup lang="ts">
import { reactive } from 'vue';
import Configurator from './components/App.vue';
import { app } from './test-config/starter/index';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';

const model = reactive(app.createModel());
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col justify-center items-center flex-grow p-4">
            <div class="text-2xl text-slate-500 mb-4">App Preview</div>
            <div class="container p-8">
                <JsonViewer :value="model" copyable />
            </div>
        </div>
        <div class="w-96 border rounded">
            <Configurator :app="app" v-model="model" />
        </div>
    </div>
</template>
