<script setup lang="ts">
import { IMAGE_UPLOADER_KEY } from '@/lib/constants';
import { ImageItem } from '@hayadev/configurator/items';
import { UploadRequestOptions } from 'element-plus';
import { inject, ref } from 'vue';
import type { CommonEvents, CommonProps } from './common';
import { NonPrimitiveTypes } from '@hayadev/configurator';

const props = defineProps<CommonProps<ImageItem>>();

const emit = defineEmits<CommonEvents<ImageItem>>();

const _model = ref(props.model?.url ?? '');

const method = ref('upload');

const uploader = inject<(file: File) => Promise<string>>(IMAGE_UPLOADER_KEY);

const onLimitExceeded = () => {
    console.error('File size exceeded limit');
};

const uploadAction = async (options: UploadRequestOptions) => {
    const url = await uploader!(options.file);
    console.log('Uploaded to:', url);
    _model.value = url;
    emitChange();
};

const emitChange = () => {
    emit('change', { $type: NonPrimitiveTypes.image, url: _model.value });
};
</script>

<template>
    <el-form-item class="m-0 flex flex-col image-item-container w-full">
        <ItemLabel :item="item" :model="props.model" />
        <el-radio-group v-model="method" class="w-full mb-1">
            <el-radio value="upload">上传</el-radio>
            <el-radio value="url">提供地址</el-radio>
        </el-radio-group>

        <el-upload
            v-if="method === 'upload'"
            class="w-full"
            accept="image/*"
            method="put"
            :limit="10 * 1024 * 1024"
            :show-file-list="false"
            :on-exceed="onLimitExceeded"
            :http-request="uploadAction"
        >
            <div v-if="!_model" class="w-32 h-32 flex items-center justify-center border border-dashed rounded">
                <el-icon size="16"><i-ep-plus /> </el-icon>
            </div>
            <el-image v-else :src="_model" class="w-full"
                ><template #placeholder>
                    <div>Loading...</div>
                </template>
                <template #error>
                    <div class="w-full h-32 bg-gray-200 flex items-center justify-center"><p>加载失败</p></div>
                </template>
            </el-image>
        </el-upload>
        <div v-else class="flex flex-col w-full gap-2">
            <el-input v-model="_model" placeholder="图片URL" @change="emitChange" />
            <el-image :src="_model" class="w-full"
                ><template #placeholder>
                    <div>Loading...</div>
                </template>
                <template #error>
                    <div class="w-full h-32 bg-gray-200 flex items-center justify-center"><p>加载失败</p></div>
                </template>
            </el-image>
        </div>
    </el-form-item>
</template>

<style>
.image-item-container .el-upload {
    @apply w-full;
}
</style>
