<script lang="ts" setup>
definePageMeta({
    layout: 'auth',
});

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

async function signup(e: Event) {
    try {
        await $fetch('/api/signup', {
            method: 'POST',
            body: new FormData(e.target as HTMLFormElement),
        });
    } catch (e: any) {
        ElMessage.error(e.data?.message ?? e.message);
        return;
    }
    await navigateTo('/');
}
</script>

<template>
    <section class="bg-gray-50 dark:bg-gray-900 w-full">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                欢迎访问GAIA
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                    >
                        新建一个账号
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#" @submit.prevent="signup">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >邮箱</label
                            >
                            <input
                                type="email"
                                name="email"
                                id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                                v-model="email"
                            />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >密码</label
                            >
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                                v-model="password"
                            />
                        </div>
                        <div>
                            <label
                                for="confirm-password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >确认密码</label
                            >
                            <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                                v-model="confirmPassword"
                            />
                        </div>
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="terms"
                                    aria-describedby="terms"
                                    type="checkbox"
                                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    required
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="font-light text-gray-500 dark:text-gray-300"
                                    >我同意
                                    <a
                                        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        href="#"
                                        >暂时还没写的使用条款</a
                                    ></label
                                >
                            </div>
                        </div>
                        <el-button
                            type="primary"
                            size="large"
                            class="w-full"
                            :disabled="!email || !password || password !== confirmPassword"
                        >
                            创建账号
                        </el-button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            已有账号？
                            <a href="/signin" class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >登录</a
                            >
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
