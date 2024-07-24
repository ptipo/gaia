<script setup lang="ts">
import Underline from '@/lib/tiptap/underline';
import Bold from '@tiptap/extension-bold';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { ColorPickerInstance } from 'element-plus';
import { defineModel, nextTick, ref } from 'vue';

const model = defineModel<string>();

const emit = defineEmits<{
    (e: 'change', data: string): void;
}>();

const editor = useEditor({
    extensions: [
        Document,
        Paragraph,
        Text,
        TextStyle,
        Underline,
        Strike,
        Bold,
        Italic,
        Color,
        Link.configure({ openOnClick: false }),
    ],
    content: model.value,

    editorProps: {
        attributes: {
            class: 'min-h-[80px] px-4 py-2',
        },
    },

    onBlur: () => {
        model.value = editor.value?.getHTML() ?? '';
        emit('change', model.value);
    },

    onSelectionUpdate: () => {
        const { color } = editor.value?.getAttributes('textStyle') ?? {};
        textColor.value = color ?? '';
    },
});

// 追踪当前选中文字的颜色
const textColor = ref('');

const colorPicker = ref<ColorPickerInstance>();

const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
]);

const onColorPickerFocus = () => {
    // 重新聚焦到编辑器
    editor.value?.chain().focus().run();
};

const onColorPickerBlur = () => {};

const onColorChange = () => {
    if (!editor.value) {
        return;
    }

    if (textColor.value) {
        editor.value.chain().focus().setColor(textColor.value).run();
    } else {
        editor.value.chain().focus().unsetColor().run();
    }
};

const linkDialogVisible = ref(false);
const linkUrl = ref('');
const urlInput = ref<HTMLInputElement>();

const onOpenLinkDialog = () => {
    linkDialogVisible.value = true;
    linkUrl.value = editor.value?.isActive('link') ? editor.value.getAttributes('link').href : '';
};

const onChangeLink = () => {
    let linkValue = linkUrl.value;

    if (linkValue) {
        // 默认url scheme
        if (!linkValue.startsWith('http://') && !linkValue.startsWith('https://') && !linkValue.startsWith('mailto:')) {
            linkValue = `https://${linkValue}`;
        }
    }

    if (linkValue) {
        editor.value?.chain().focus().extendMarkRange('link').setLink({ href: linkValue }).run();
    } else {
        editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    linkDialogVisible.value = false;
};
</script>

<template>
    <div v-if="editor" class="w-full flex flex-col border rounded-md bg-white rich-text">
        <!-- 链接设置对话框 -->
        <el-dialog
            title="设置链接"
            v-model="linkDialogVisible"
            width="500"
            :close-on-click-modal="false"
            @open-auto-focus="
                () =>
                    nextTick(() => {
                        urlInput?.focus();
                    })
            "
        >
            <el-input
                v-model="linkUrl"
                placeholder="请输入链接地址"
                ref="urlInput"
                @keyup.enter.native="onChangeLink"
            />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="linkDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onChangeLink">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <el-button-group class="border-b p-1 rich-text-buttons">
            <el-button
                text
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
                ><span class="font-bold">B</span></el-button
            >
            <el-button
                text
                @click="editor.chain().focus().toggleUnderline().run()"
                :class="{
                    'is-active': editor.isActive('textStyle') && editor.getAttributes('textStyle').underline,
                }"
                ><span class="underline">U</span></el-button
            >
            <el-button
                text
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
                ><span class="font-serif italic">I</span></el-button
            >
            <el-button
                text
                @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }"
                ><span class="line-through">S</span></el-button
            >
            <el-color-picker
                ref="colorPicker"
                v-model="textColor"
                show-alpha
                size="small"
                :predefine="predefineColors"
                @focus="onColorPickerFocus"
                @blur="onColorPickerBlur"
                @change="onColorChange"
            />
            <el-button text @click="onOpenLinkDialog" :class="{ 'is-active': editor.isActive('link') }"
                ><el-icon><i-ep-link /></el-icon
            ></el-button>
        </el-button-group>
        <editor-content class="w-full" :editor="editor" />
    </div>
</template>

<style>
.rich-text .ProseMirror:focus {
    outline: none;
}

.rich-text .tiptap a {
    color: #409eff;
    text-decoration: underline;
}

.rich-text-buttons button.is-active {
    background-color: #ecf5ff;
    color: #409eff;
}

.rich-text-buttons button {
    width: 36px;
}
</style>
