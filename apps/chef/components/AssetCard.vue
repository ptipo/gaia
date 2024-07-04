<script setup lang="ts">
import type { App, Asset, User } from '@prisma/client';
import { fromNow } from '~/lib/date';
import { success } from '~/lib/message';

const props = defineProps<{ asset: Asset & { owner: User; app: App } }>();

defineEmits<{
    (e: 'click'): void;
}>();

const runtimeConfig = useRuntimeConfig();

const onOpenPublishUrl = () => {
    window.open(`${runtimeConfig.public.publishPageAccessPoint}/${props.asset.id}`);
};

const onCopyPublishUrl = () => {
    navigator.clipboard.writeText(`${runtimeConfig.public.publishPageAccessPoint}/${props.asset.id}`);
    success('发布地址已复制到剪贴板');
};

const onCopyCode = () => {
    const asset = props.asset;
    const app = asset.app;
    const codeModeTemplate = asset.app.ptCodeMode!;

    console.log('copy code:\n' + codeModeTemplate);

    const result = codeModeTemplate
        .replaceAll('{{assetId}}', asset.id)
        .replaceAll('{{assetBundle}}', app.bundle)
        .replaceAll('{{assetHtmlTag}}', app.htmlTagName)
        .replaceAll('{{assetVersion}}', 'latest');

    navigator.clipboard.writeText(result);
    success('代码已复制到剪贴板');
};
</script>

<template>
    <div class="flex flex-col items-center w-64 h-48 border rounded-lg shadow-lg relative p-4 group">
        <div class="flex justify-between w-full">
            <div class="text-xs text-blue-400 italic self-start">{{ asset.app.name }}</div>
            <el-dropdown trigger="click" size="small"
                ><el-icon class="invisible group-hover:visible"><ElIconMoreFilled /></el-icon>
                <template #dropdown>
                    <el-dropdown-menu
                        ><el-dropdown-item :disabled="!asset.publishUrl" @click="onOpenPublishUrl"
                            >访问发布页面</el-dropdown-item
                        >
                        <el-dropdown-item :disabled="!asset.publishUrl" @click="onCopyPublishUrl"
                            >复制发布地址</el-dropdown-item
                        >
                        <el-dropdown-item :disabled="!asset.publishUrl" @click="onCopyCode"
                            >复制CodeMode代码</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="flex flex-col flex-grow w-full cursor-pointer" @click="() => $emit('click')">
            <div class="text-xl flex-grow flex items-center justify-center">
                <div>{{ asset.name }}</div>
            </div>
            <div class="flex flex-col w-full text-xs text-gray-500 italic gap-1 self-start">
                <div>创建于 {{ fromNow(asset.createdAt) }}</div>
                <div>更新于 {{ fromNow(asset.updatedAt) }}</div>
            </div>
        </div>
    </div>
</template>
