<script setup lang="ts">
import { ref } from 'vue';
const activeName = ref('content');
</script>

<template>
    <div class="p-4">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Content" name="content">Content</el-tab-pane>
            <el-tab-pane label="Design" name="design">Design</el-tab-pane>
            <el-tab-pane label="Setting" name="setting">Setting</el-tab-pane>
        </el-tabs>
    </div>
</template>
