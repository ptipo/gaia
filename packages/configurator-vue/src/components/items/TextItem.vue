<script setup lang="ts">
import type { inferConfigItem } from '@gaia/configurator';
import type { TextItem } from '@gaia/configurator/items';
import { ref } from 'vue';

defineProps<{ item: TextItem }>();
const model = defineModel<inferConfigItem<TextItem>>();

// use a separate inner model to avoid losing focus on every keystroke
const data = ref(model.value);

const onValueChange = () => {
    model.value = data.value;
};
</script>

<template>
    <el-form-item>
        <div slot="label" class="flex items-center mb-2">
            <div class="text-sm">
                {{ item.name }}
            </div>
            <el-tooltip
                v-if="item.help"
                class="box-item"
                effect="dark"
                :content="item.help"
                placement="top"
                ><el-icon class="ml-2"><i-ep-info-filled /></el-icon
            ></el-tooltip>
        </div>
        <el-input v-model="data" @change="onValueChange" />
    </el-form-item>
</template>
