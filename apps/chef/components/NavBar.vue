<script lang="ts" setup>
import type { App } from '@prisma/client';
import { useFindManyApp } from '~/composables/data';
import { error } from '~/lib/message';

const user = useUser();

const { data: apps, isLoading } = useFindManyApp();

defineEmits<{
    (e: 'create', data: { app: App }): void;
}>();

async function logout() {
    try {
        await $fetch('/api/logout', {
            method: 'POST',
        });
    } catch (e: any) {
        error(e.data?.message ?? e.message);
        return;
    }
    await navigateTo('/signin');
}
</script>

<template>
    <nav class="border-b border-gray-200 px-4 lg:px-6 py-2.5">
        <div class="flex gap-2 justify-end items-center">
            <el-dropdown
                ><el-button type="primary" :loading="isLoading">+ 新建资产</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="app in apps" :key="app.id" @click="() => $emit('create', { app })">{{
                            app.name
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown>
                <el-avatar
                    class="cursor-pointer"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>{{ user?.email }}</el-dropdown-item>
                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </nav>
</template>
