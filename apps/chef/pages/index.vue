<script lang="ts" setup>
const user = useUser();

async function logout() {
    try {
        await $fetch('/api/logout', {
            method: 'POST',
        });
    } catch (e: any) {
        alert('Failed to logout: ' + (e.data?.message ?? e.message));
        return;
    }
    await navigateTo('/signin');
}
</script>

<template>
    <div class="flex flex-col gap-4 items-center">
        <h1 class="text-3xl">Welcome to GAIA</h1>
        <div>You are: {{ user?.email }}</div>
        <button @click="logout">Logout</button>
    </div>
</template>
