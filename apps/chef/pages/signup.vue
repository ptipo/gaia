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
    confirmPassword: '',
});

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<typeof formState>>({
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
});

function validateEmail(_rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请输入邮箱'));
    } else {
        const { success } = z.string().email().safeParse(value);
        if (!success) {
            callback(new Error('请输入正确的邮箱'));
        } else {
            callback();
        }
    }
}

function validatePassword(_rule: any, value: any, callback: any) {
    if (!formRef.value) {
        return;
    }
    if (value === '') {
        callback(new Error('请输入密码'));
    } else {
        if (formState.confirmPassword !== '') {
            formRef.value.validateField('confirmPassword');
        }
        callback();
    }
}

function validateConfirmPassword(_rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请输入确认密码'));
    } else if (value !== formState.password) {
        callback(new Error('两次输入密码不一致'));
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
                await $fetch('/api/signup', {
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
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold"> 欢迎访问HAYA </a>
            <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight">新建一个账号</h1>
                    <el-form
                        class="space-y-4 md:space-y-6"
                        ref="formRef"
                        :rules="rules"
                        :model="formState"
                        label-position="top"
                    >
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="formState.email" type="email" />
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input v-model="formState.password" type="password" />
                        </el-form-item>

                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="formState.confirmPassword" type="password" />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" size="large" class="w-full" @click="onSubmit"> 注册 </el-button>
                        </el-form-item>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            已有账号？
                            <a href="/signin" class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >登录</a
                            >
                        </p>
                    </el-form>
                </div>
            </div>
        </div>
    </section>
</template>
