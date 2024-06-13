<script lang="ts" setup>
import { useFindUniqueAsset } from '~/composables/data';
import { AppConfigurator, type EditPathRecord, type Issue, type SelectionData } from '@hayadev/configurator-vue';
import '@hayadev/configurator-vue/dist/index.css';
import type { AppInstance, Concept } from '@hayadev/configurator';
import { type BaseConceptModel, createAppInstance } from '@hayadev/configurator';
import { loadAppBundle } from '~/lib/app';

const route = useRoute();

const app = ref<AppInstance<Concept>>();
const model = ref<BaseConceptModel>();

// current edit path in the configurator
const editPath = ref<EditPathRecord[]>([]);

// current selected concept instance
const selection = ref<SelectionData>();

// validation issues
const issues = ref<Issue[]>([]);

const { data: asset } = useFindUniqueAsset({
    where: { id: route.params.id as string },
    include: { app: true },
});

watch(asset, async (value) => {
    if (!value?.app.bundle) {
        console.error('No bundle found in the app instance.');
        return;
    }

    const module = await loadAppBundle(value.app.bundle);

    if (!module.config) {
        console.error('No config found in the app bundle.');
        return;
    }

    app.value = createAppInstance(module.config);
    model.value = app.value.model;
});

const onAppChange = (data: BaseConceptModel) => {
    if (!app.value) {
        return;
    }
    console.log('App change:', data);
    app.value.model = data as typeof app.value.model;
    model.value = data;
    // validate(model.value);
    // resetFormConfig();
};

const goBack = () => {
    navigateTo('/');
};
</script>

<template>
    <el-container class="flex flex-col gap-4 h-full p-8">
        <div class="flex justify-between">
            <el-page-header @back="goBack">
                <template #content>
                    <div class="flex items-center group">
                        <span class="text-large font-600 mr-3"> {{ asset?.name }} </span>
                        <el-icon class="invisible group-hover:visible cursor-pointer"><ElIconEditPen /></el-icon>
                    </div>
                </template>
            </el-page-header>
            <div class="flex button-group">
                <el-button>保存</el-button>
                <el-button>删除</el-button>
                <el-button type="primary">发布</el-button>
            </div>
        </div>
        <div v-if="app && model" class="flex gap-4 w-full h-full">
            <div class="flex-grow border-1 rounded bg-slate-100"></div>
            <div class="w-80 border rounded" v-if="app">
                <AppConfigurator
                    :app="app"
                    :model="model"
                    v-model:editPath="editPath"
                    v-model:selection="selection"
                    @change="onAppChange"
                />
            </div>
        </div>
    </el-container>
</template>

<style scoped>
.button-group button {
    width: 6rem;
}
</style>
