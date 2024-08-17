<script setup lang="ts">
import { APP_KEY, CONFIG_TRANSLATOR_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { ident } from '@/lib/i18n';
import {
    makeConfigItemSchema,
    TranslationFunction,
    type AppInstance,
    type BaseConceptModel,
    type Concept,
} from '@hayadev/configurator';
import type { ConfigItemBase } from '@hayadev/configurator/items';
import { computed, inject, ref, unref, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    item: ConfigItemBase;
    model: unknown | undefined;
    parentModel: BaseConceptModel;
}>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const { t } = useI18n();
const ct = inject<TranslationFunction>(CONFIG_TRANSLATOR_KEY, ident);

const enabled = defineModel<boolean>('enabled');

const errorMessage = ref('');

const schema = computed(() =>
    makeConfigItemSchema(props.item, {
        app: app!,
        rootModel: rootModel?.value!,
        parentModel: props.parentModel,
        currentModel: props.model,
        ct: unref(ct),
    })
);

const validate = () => {
    errorMessage.value = '';

    if (props.model === undefined) {
        if (props.item.required || (props.item.guarded && enabled.value)) {
            errorMessage.value = t('itemRequired');
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
                <div class="mr-1">
                    {{ ct(item.name ?? '') }} {{ item.required || (item.guarded && enabled) ? '*' : '' }}
                </div>
                <el-tooltip v-if="errorMessage" :content="errorMessage" placement="top"
                    ><el-icon color="#B91C1A"><i-ep-warning /></el-icon
                ></el-tooltip>
            </div>
            <el-tooltip v-if="item.help" class="box-item" :content="ct(item.help)" placement="top"
                ><el-icon class="ml-2"><i-ep-info-filled /></el-icon
            ></el-tooltip>
        </div>
        <el-switch v-if="item.guarded" v-model="enabled"></el-switch>
    </div>
</template>
