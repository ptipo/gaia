<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept, ConfigItem } from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';
import { Ref, computed, inject, ref } from 'vue';
import { EnterConceptData } from '../types';
import HasManyItemComponent from './HasManyItem.vue';

const props = withDefaults(
    defineProps<{
        /**
         * The concept of the element
         */
        concept: Concept;

        /**
         * The model of the concept
         */
        model: BaseConceptModel;

        /**
         * Whether to enable inline editing
         */
        inlineEditing?: boolean;

        /**
         * Whether to allow delete
         */
        allowDelete?: boolean;
    }>(),
    {
        inlineEditing: false,
        allowDelete: true,
    }
);

const emit = defineEmits<{
    /**
     * Emitted when the model is changed
     */
    (e: 'change', data: BaseConceptModel): void;

    /**
     * Emitted when a sibling is added
     */
    (e: 'addSibling', data: { concept: Concept; model: BaseConceptModel }): void;

    /**
     * Emitted when an element is cloned
     */
    (e: 'clone', data: { concept: Concept; model: BaseConceptModel }): void;

    /**
     * Emitted when an element is deleted
     */
    (e: 'delete', data: { concept: Concept; model: BaseConceptModel }): void;

    /**
     * Emitted when entering editing of a nested concept
     */
    (e: 'enter', data: EnterConceptData): void;
}>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const showEditDialog = ref(false);
const currentEditItem = ref<{ key: string; item: ConfigItem } | undefined>();
const currentEditModel = ref<any>();

const elementSummary = computed(() => {
    if (props.concept.summary) {
        return props.concept.summary({
            app: app!,
            rootModel: rootModel?.value!,
            currentModel: props.model,
        });
    }
    return props.model.name ?? props.concept.displayName ?? props.concept.name;
});

// filter items that are inline editable
const inlineEditableItems = computed(() => {
    return Object.entries(props.concept.items)
        .filter(([_, value]) => !['has-many'].includes(value.type))
        .map(([key, value]) => ({ key, item: value }));
});

// find the first has-many child item (for inline-listing)
const nestedHasMany = computed(() => {
    const found = Object.entries(props.concept.items).find(([_, item]) => item.type === 'has-many');
    if (!found) {
        return undefined;
    }
    return { key: found[0], item: found[1] as HasManyItem };
});

const onEdit = (key: string, item: ConfigItem) => {
    if (item.type === 'has') {
        // enter editing of a nested concept
        emit('enter', {
            concept: item.concept,
            model: props.model[key] as BaseConceptModel,
            parentKey: [key],
        });
        return;
    }

    // pop up the edit dialog
    currentEditItem.value = { key, item };
    currentEditModel.value = props.model[key];
    showEditDialog.value = true;
};

const onCurrentEditChange = (data: any) => {
    currentEditModel.value = data;
};

const onSaveEdit = () => {
    if (currentEditItem.value) {
        const nextModel = {
            ...props.model,
            [currentEditItem.value!.key]: currentEditModel.value,
        };
        emit('change', nextModel);
    }
    showEditDialog.value = false;
};

const onCancelEdit = () => {
    currentEditItem.value = undefined;
    currentEditModel.value = undefined;
    showEditDialog.value = false;
};

const onEditNested = () => {
    if (!props.inlineEditing) {
        // enter nested editing of a concept
        emit('enter', {
            concept: props.concept,
            model: props.model,
            parentKey: [],
        });
    }
};

const onEnterNested = (parentKey: string, data: EnterConceptData) => {
    emit('enter', { ...data, parentKey: [parentKey, ...data.parentKey] });
};

const onChangeNested = (parentKey: string, data: BaseConceptModel[]) => {
    const nextModel = { ...props.model, [parentKey]: data };
    emit('change', nextModel);
};
</script>

<template>
    <div class="flex justify-between" :class="{ 'cursor-pointer': !inlineEditing }" @click="onEditNested">
        <div>
            {{ elementSummary }}
        </div>
        <el-dropdown v-if="model">
            <el-icon class="cursor-pointer">
                <i-ep-more-filled />
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <div v-if="inlineEditing">
                        <el-dropdown-item v-for="{ key, item } in inlineEditableItems" @click="onEdit(key, item)"
                            ><el-icon><i-ep-edit /></el-icon> {{ item.name }}</el-dropdown-item
                        >
                    </div>
                    <div v-else>
                        <el-dropdown-item @click="onEditNested"
                            ><el-icon><i-ep-edit /></el-icon> 设置</el-dropdown-item
                        >
                    </div>
                    <el-dropdown-item divided @click="$emit('addSibling', { concept, model })"
                        ><el-icon><i-ep-plus /></el-icon>在下方添加{{ concept.displayName }}</el-dropdown-item
                    >
                    <el-dropdown-item divided @click="$emit('clone', { concept, model })"
                        ><el-icon><i-ep-document-copy /></el-icon>复制</el-dropdown-item
                    >
                    <el-dropdown-item @click="$emit('delete', { concept, model })" :disabled="!allowDelete"
                        ><el-icon><i-ep-delete /></el-icon>删除</el-dropdown-item
                    >
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <!-- inline listing has-many -->
    <div v-if="nestedHasMany" class="pt-2 pl-2">
        <HasManyItemComponent
            :item="nestedHasMany.item"
            :model="props.model[nestedHasMany.key] as BaseConceptModel[]"
            inline
            @change="(data) => onChangeNested(nestedHasMany!.key, data)"
            @enter="(data) => onEnterNested(nestedHasMany!.key, data)"
        />
    </div>

    <!-- inline-editing dialog -->
    <el-dialog v-model="showEditDialog" v-if="currentEditItem" :title="`修改${currentEditItem.item.name}`" width="500">
        <component
            :is="getItemComponent(currentEditItem.item)"
            :item="currentEditItem.item"
            :model="currentEditModel"
            :parentModel="model"
            @change="(data: any) => onCurrentEditChange(data)"
        ></component>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onCancelEdit">取消</el-button>
                <el-button type="primary" @click="onSaveEdit">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>
