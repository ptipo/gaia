<script lang="ts" setup>
import type { App } from '@prisma/client';
import { useFindManyApp, useUpdateUser } from '~/composables/data';
import { defaultLocale } from '~/i18n';
import { setDayJSLocale } from '~/lib/date';
import { error } from '~/lib/message';

const user = useUser();

const { data: apps, isLoading } = useFindManyApp();
const { mutateAsync: updateUser } = useUpdateUser();

const settingsDialogVisible = ref(false);

const locale = ref(user.value?.locale ?? defaultLocale);
const { locales, setLocale } = useI18n();

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

async function onLocaleChange(locale: string) {
    setLocale(locale);
    setDayJSLocale(locale);
    if (user.value) {
        // save user
        await updateUser({ where: { id: user.value.id }, data: { locale } });
    }
}
</script>

<template>
    <nav class="border-b border-gray-200 px-4 lg:px-6 py-2.5">
        <div class="flex gap-2 justify-end items-center">
            <el-dropdown trigger="click"
                ><el-button type="primary" :loading="isLoading">+ {{ $t('createAsset') }}</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="app in apps" :key="app.id" @click="() => $emit('create', { app })">{{
                            app.name
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown trigger="click">
                <el-avatar
                    class="cursor-pointer"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="settingsDialogVisible = true">{{ user?.email }}</el-dropdown-item>
                        <el-dropdown-item divided @click="logout">{{ $t('logout') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </nav>

    <el-dialog :title="$t('settings')" v-model="settingsDialogVisible">
        <el-form class="p-8">
            <el-form-item :label="$t('language')">
                <el-select v-model="locale" :placeholder="$t('selectLanguage')" @change="onLocaleChange">
                    <el-option v-for="locale in locales" :key="locale.code" :label="locale.name" :value="locale.code" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
