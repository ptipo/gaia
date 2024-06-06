<script setup lang="ts">
import { makeConfigItemSchema } from '@gaia/configurator';
import type { ConfigItemBase } from '@gaia/configurator/items';
import { ref, watch } from 'vue';

const props = defineProps<{
    item: ConfigItemBase;
    model: unknown | undefined;
}>();

const enabled = defineModel<boolean>('enabled');
const schema = makeConfigItemSchema(props.item);
const errorMessage = ref('');

const validate = () => {
    errorMessage.value = '';

    if (props.model === undefined) {
        if (props.item.required || (props.item.guarded && enabled.value)) {
            errorMessage.value = '此选项为必填';
        } else {
            return;
        }
    }

    const parseResult = schema.safeParse(props.model);
    if (parseResult.error) {
        errorMessage.value = parseResult.error.issues.map((issue) => issue.message).join(', ');
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
