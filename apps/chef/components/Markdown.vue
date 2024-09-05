<script setup lang="ts">
import markdownit from 'markdown-it';
import { computed } from 'vue';

const props = defineProps<{ value: string }>();

const rendered = computed(() => {
    const md = markdownit();
    return md.render(props.value);
});
</script>

<template>
    <span v-html="rendered" />
</template>

<style scoped>
:deep(ol li) {
    list-style: auto;
}

:deep(ul li) {
    list-style: auto;
}
</style>
