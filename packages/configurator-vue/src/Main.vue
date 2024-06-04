<script setup lang="ts">
import { BaseConceptModel, createAppInstance } from '@gaia/configurator';
import { ref, onMounted } from 'vue';
import Configurator from './components/App.vue';
// @ts-expect-error
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
// @ts-expect-error
import { config as FormApp, app } from '../../../demo/supa-form/dist';

const app = createAppInstance(FormApp);
const model = ref<BaseConceptModel>(app.model);

const onAppChange = (data: BaseConceptModel) => {
    app.model = model.value = data as typeof app.model;
    const form = document.getElementById('pt-form') as HTMLElement;
    form.setAttribute('config', app.stringifyModel(app.model));
};
function onClick() {
    const form = document.getElementById('pt-form') as HTMLElement;
    const parent = form.parentElement!;
    parent.removeChild(form);
    parent.innerHTML = `<pt-form id="pt-form" config=${app.stringifyModel(
        app.model
    )} ></pt-form>`;
}

onMounted(async () => {
    // // @ts-ignore
    // const appModule: any = await import(
    //     '../../../demo/supa-form/dist/index.js'
    // );
    document.addEventListener('pt-form-submit', function (event: any) {
        alert(`form submit data:${JSON.stringify(event.detail, null, 2)}`);
    });
});
</script>

<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col gap-8 justify-center items-center flex-grow w-full h-full px-4 py-16"
        >
            <div class="text-2xl text-slate-500">App Preview</div>
            <div class="border rounded bg-cyan-50 w-full h-1/2 overflow-auto">
                <pt-form id="pt-form"></pt-form>
            </div>
            <button
                type="button"
                @click="onClick"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                refresh
            </button>
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
