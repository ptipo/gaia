<script setup lang="ts">
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { makeConfigItemSchema, type AppInstance, type BaseConceptModel, type Concept } from '@hayadev/configurator';
import type { ConfigItemBase } from '@hayadev/configurator/items';
import { computed, inject, ref, watch, type Ref } from 'vue';

const props = defineProps<{
    item: ConfigItemBase;
    model: unknown | undefined;
    parentModel: BaseConceptModel;
}>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const enabled = defineModel<boolean>('enabled');

const errorMessage = ref('');

const schema = computed(() =>
    makeConfigItemSchema(props.item, {
        app: app!,
        rootModel: rootModel?.value!,
        parentModel: props.parentModel,
        currentModel: props.model,
    })
);

const validate = () => {
    errorMessage.value = '';

    if (props.model === undefined) {
        if (props.item.required || (props.item.guarded && enabled.value)) {
            errorMessage.value = '此选项为必填';
        } else {
            return;
        }
    }

    const parseResult = schema.value.safeParse(props.model);
    if (parseResult.error) {
        errorMessage.value = parseResult.error.issues
            .filter((issue) => issue.path.length === 0) // only show current-level error
            .map((issue) => issue.message)
            .join(', ');
    }
};

watch(
    () => props.model,
    () => validate(),
    { immediate: true }
);

watch(enabled, () => validate());
</script>

<template>
    <div slot="label" class="flex items-center justify-between w-full">
        <div class="flex items-center">
            <div class="flex items-center">
                <div class="mr-1">{{ item.name }} {{ item.required || (item.guarded && enabled) ? '*' : '' }}</div>
                <el-tooltip v-if="errorMessage" :content="errorMessage" placement="top"
                    ><el-icon color="#B91C1A"><i-ep-warning /></el-icon
                ></el-tooltip>
            </div>
            <el-tooltip v-if="item.help" class="box-item" :content="item.help" placement="top"
                ><el-icon class="ml-2"><i-ep-info-filled /></el-icon
            ></el-tooltip>
        </div>
        <el-switch v-if="item.guarded" v-model="enabled"></el-switch>
    </div>
</template>
