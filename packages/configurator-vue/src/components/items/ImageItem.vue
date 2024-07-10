<script setup lang="ts">
import { ImageItem } from '@hayadev/configurator/items';
import { UploadFile, UploadRawFile } from 'element-plus';
import { ref } from 'vue';
import type { CommonEvents, CommonProps } from './common';
import { NonPrimitiveTypes } from '@hayadev/configurator';

const props = defineProps<CommonProps<ImageItem>>();

const emit = defineEmits<CommonEvents<ImageItem>>();

const imageUrl = ref(props.model?.url ?? '');

const onUploadSuccess = (_resp: any, _file: UploadFile) => {
    // TODO: real upload
};

const onBeforeUpload = async (rawFile: UploadRawFile) => {
    // TODO: real upload
    const blob = new Blob([await rawFile.arrayBuffer()], {
        type: rawFile.type,
    });
    const url = URL.createObjectURL(blob);
    imageUrl.value = url;

    emit('change', { $type: NonPrimitiveTypes.image, url });

    return false;
};
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" :model="props.model" />
        <el-upload
            accept="image/*"
            :show-file-list="false"
            :before-upload="onBeforeUpload"
            :on-success="onUploadSuccess"
        >
            <div v-if="!imageUrl" class="w-32 h-32 flex items-center justify-center border border-dashed rounded">
                <el-icon size="16"><i-ep-plus /> </el-icon>
            </div>
            <el-image v-else :src="imageUrl" class="w-full"
                ><template #placeholder>
                    <div>Loading...</div>
                </template></el-image
            >
        </el-upload>
    </el-form-item>
</template>
