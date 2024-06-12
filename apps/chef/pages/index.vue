<script lang="ts" setup>
import type { App } from '@prisma/client';
import { useCreateAsset, useFindManyAsset } from '~/composables/data';
import { prompt } from '~/lib/message';

const { mutateAsync: createAsset } = useCreateAsset();

const { data: assets, isLoading } = useFindManyAsset({
    include: { owner: true, app: true },
    orderBy: { createdAt: 'desc' },
});

const onCreate = async ({ app }: { app: App }) => {
    const name = await prompt('创建资产', '请输入资产名称');
    if (!name) {
        return;
    }
    const created = await createAsset({
        data: { name, app: { connect: { id: app.id } } },
    });
    ElNotification({
        title: '资产创建成功',
        type: 'success',
    });
};
</script>

<template>
    <div class="w-full h-full">
        <el-container class="h-full">
            <el-header><NavBar @create="onCreate" /></el-header>
            <el-main>
                <div class="flex flex-col items-center w-full h-full">
                    <h1 class="text-3xl mt-8 mb-12">我的资产</h1>
                    <div v-if="!isLoading" class="flex flex-wrap gap-8">
                        <AssetCard v-for="asset in assets" :key="asset.id" :asset="asset" />
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
