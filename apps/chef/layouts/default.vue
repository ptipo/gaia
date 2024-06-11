<script lang="ts" setup>
const user = useUser();

if (!user.value) {
    await navigateTo('/signin');
}
</script>
<template>
    <div class="flex items-center justify-center w-full h-screen">
        <AppHeader />
        <slot />
        <AppFooter />
    </div>
</template>
