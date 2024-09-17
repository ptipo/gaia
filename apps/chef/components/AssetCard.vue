<script setup lang="ts">
import type { App, Asset, User } from '@prisma/client';
import { useDeleteAsset } from '~/composables/data';
import { fromNow } from '~/lib/date';
import { confirmDelete, error, success, confirmMessage } from '~/lib/message';

const props = defineProps<{ asset: Asset & { owner: User; app: App } }>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'clone', asset: { id: string }): void;
    (e: 'delete', asset: Asset): void;
}>();

const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();

const { mutateAsync: deleteAsset } = useDeleteAsset();

const checkPublish = () => {
    if (!props.asset.publishUrl) {
        confirmMessage(t('notPublished'), t).then((confirmed) => {
            if (confirmed) {
                emit('click');
            }
        });
        return false;
    }
    return true;
};

const onOpenPublishUrl = () => {
    if (checkPublish()) {
        window.open(`${props.asset.publishUrl}`);
    }
};

const onCopyPublishUrl = () => {
    if (checkPublish()) {
        navigator.clipboard.writeText(`${props.asset.publishUrl}`);
        success(t('publishUrlCopiedToClipboard'));
    }
};

const onCopyCode = () => {
    if (!checkPublish()) return;

    const asset = props.asset;
    const app = asset.app;
    const codeModeTemplate = asset.app.ptCodeMode!;

    const result = codeModeTemplate
        .replaceAll('{{assetId}}', asset.id)
        .replaceAll('{{assetBundle}}', app.bundle)
        .replaceAll('{{assetHtmlTag}}', app.htmlTagName)
        .replaceAll('{{assetVersion}}', asset.appVersion || 'latest')
        .replaceAll('{{assetAccessPoint}}', runtimeConfig.public.publishAccessPoint);

    console.log('copy code:\n' + result);

    navigator.clipboard.writeText(result);
    success(t('codeCopiedToClipboard'));
};

const onCopyAsset = async () => {
    try {
        const { data: newAsset } = await $fetch(`/api/asset/${props.asset.id}/clone`, {
            method: 'POST',
        });
        success(t('cloneSuccess'));
        emit('clone', newAsset);
    } catch (err) {
        error(t('unableToClone'));
        console.error('Failed to save asset:', err);
        return;
    }
};

const onDeleteAsset = async () => {
    if (await confirmDelete(t('sureToDeleteAsset', { name: props.asset.name }))) {
        try {
            await deleteAsset({ where: { id: props.asset.id } });
            success(t('deleteSuccess'));
            emit('delete', props.asset);
        } catch (err) {
            error(t('unableToDelete'));
            console.error('Failed to save asset:', err);
        }
    }
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
                        ><el-dropdown-item @click="onOpenPublishUrl">{{ $t('visitPublishedPage') }}</el-dropdown-item>
                        <el-dropdown-item @click="onCopyPublishUrl">{{ $t('copyPublishUrl') }}</el-dropdown-item>
                        <el-dropdown-item @click="onCopyCode">{{ $t('copyCodeMode') }}</el-dropdown-item>
                        <el-dropdown-item @click="onCopyAsset" divided>{{ $t('clone') }}</el-dropdown-item>
                        <el-dropdown-item @click="onDeleteAsset">{{ $t('delete') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="flex flex-col flex-grow w-full cursor-pointer" @click="() => $emit('click')">
            <div class="text-xl flex-grow flex items-center justify-center">
                <div>{{ asset.name }}</div>
            </div>
            <div class="flex flex-col w-full text-xs text-gray-500 italic gap-1 self-start">
                <div>{{ $t('createdAt') }} {{ fromNow(asset.createdAt) }}</div>
                <div>{{ $t('updatedAt') }} {{ fromNow(asset.updatedAt) }}</div>
            </div>
        </div>
    </div>
</template>
