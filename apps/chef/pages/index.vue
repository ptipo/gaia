<script lang="ts" setup>
import type { App, Asset } from '@prisma/client';
import { useCreateAsset, useFindManyAsset } from '~/composables/data';
import { prompt, success } from '~/lib/message';

const { mutateAsync: createAsset } = useCreateAsset();

const {
    data: assets,
    isLoading,
    refetch,
} = useFindManyAsset({
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

    if (created) {
        success('资产创建成功');
        navigateTo(`/asset/${created.id}`);
    }
};

const onAssetClick = (asset: Asset) => {
    navigateTo(`/asset/${asset.id}`);
};
</script>

<template>
    <div class="w-full h-full">
        <el-container v-loading="isLoading" class="h-full">
            <el-header><NavBar @create="onCreate" /></el-header>
            <el-main>
                <div class="flex flex-col items-center w-full h-full">
                    <h1 class="text-3xl mt-8 mb-12">我的资产</h1>
                    <div v-if="assets" class="flex flex-wrap container mx-auto gap-8">
                        <AssetCard
                            v-for="asset in assets"
                            :key="asset.id"
                            :asset="asset"
                            @click="() => onAssetClick(asset)"
                            @clone="
                                () => refetch() // clone is not done with hooks, so need to manually invalidate
                            "
                        />
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
