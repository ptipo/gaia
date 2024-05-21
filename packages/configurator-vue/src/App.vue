<script setup lang="ts">
import Configurator from './components/Configurator.vue';
</script>

<template>
    <div class="flex w-full h-full">
        <div class="flex justify-center items-center flex-grow p-4">
            <div class="text-2xl text-slate-500">App Preview</div>
        </div>
        <div class="w-80 border rounded">
            <Configurator />
        </div>
    </div>
</template>
