<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { z } from 'zod';
import { error } from '~/lib/message';

definePageMeta({
    layout: 'auth',
});

const formState = reactive({
    email: '',
    password: '',
});

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<typeof formState>>({
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
});

const { t } = useI18n();

function validateEmail(_rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error(t('inputEmail')));
    } else {
        const { success } = z.string().email().safeParse(value);
        if (!success) {
            callback(new Error(t('inputValidEmail')));
        } else {
            callback();
        }
    }
}

function validatePassword(_rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error(t('inputPassword')));
    } else {
        callback();
    }
}

async function onSubmit() {
    if (!formRef.value) {
        return;
    }
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await $fetch('/api/login', {
                    method: 'POST',
                    body: { email: formState.email, password: formState.password },
                });
                await navigateTo('/');
            } catch (err: any) {
                error(err.data?.message ?? err.message);
            }
        }
    });
}
</script>

<template>
    <section class="w-full">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold">{{ $t('welcomeToHaya') }}</a>
            <div class="w-full rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">{{ $t('login') }}</h1>
                    <el-form
                        class="space-y-4 md:space-y-6"
                        ref="formRef"
                        :rules="rules"
                        :model="formState"
                        label-position="top"
                    >
                        <el-form-item :label="$t('email')" prop="email">
                            <el-input v-model="formState.email" type="email" />
                        </el-form-item>

                        <el-form-item :label="$t('password')" prop="password">
                            <el-input v-model="formState.password" type="password" />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" size="large" class="w-full" @click="onSubmit">
                                {{ $t('login') }}
                            </el-button>
                        </el-form-item>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            {{ $t('noAccountYet') }}
                            <a
                                href="/signup"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >{{ $t('signup') }}</a
                            >
                        </p>
                    </el-form>
                </div>
            </div>
        </div>
    </section>
</template>
