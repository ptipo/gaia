<script setup lang="ts">
import type { App, Asset, User } from '@prisma/client';
import { useDeleteAsset } from '~/composables/data';
import { fromNow } from '~/lib/date';
import { confirmDelete } from '~/lib/message';

const props = defineProps<{ asset: Asset & { owner: User; app: App } }>();

defineEmits<{
    (e: 'click'): void;
}>();

const { mutateAsync: deleteAsset } = useDeleteAsset();

const onDelete = async () => {
    if (await confirmDelete(`确定要删除资产 "${props.asset.name}" 吗？`)) {
        await deleteAsset({ where: { id: props.asset.id } });
    }
};
</script>

<template>
    <div class="flex flex-col items-center w-64 h-48 border rounded-lg shadow-lg relative p-4 cursor-pointer group">
        <div class="flex justify-between w-full">
            <div class="text-xs text-blue-400 italic self-start">{{ asset.app.name }}</div>
            <el-dropdown trigger="click"
                ><el-icon class="invisible group-hover:visible"><ElIconMoreFilled /></el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="onDelete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="text-xl flex-grow flex items-center justify-center" @click="() => $emit('click')">
            <div>{{ asset.name }}</div>
        </div>
        <div class="flex flex-col text-xs text-gray-500 italic gap-1 self-start">
            <div>创建于 {{ fromNow(asset.createdAt) }}</div>
            <div>更新于 {{ fromNow(asset.updatedAt) }}</div>
        </div>
    </div>
</template>
