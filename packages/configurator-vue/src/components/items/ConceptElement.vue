<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept, ConfigItem } from '@hayadev/configurator';
import type { HasItem, HasManyItem } from '@hayadev/configurator/items';
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
     * Emitted when the selection is changed
     */
    (e: 'selected', data: { concept: Concept; model: BaseConceptModel }): void;

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
        .filter(([_, value]) => !['has-many', 'has'].includes(value.type))
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

// find all 'has' items in the concept (for showing them inline)
const nestedHas = computed(() => {
    return Object.entries(props.concept.items)
        .filter(([_, item]) => item.type === 'has')
        .map(([key, item]) => ({ key, item: item as HasItem, model: props.model[key] as BaseConceptModel }));
});

const onEdit = (key: string, item: ConfigItem) => {
    if (item.type === 'has') {
        // enter editing of a nested concept
        emit('enter', {
            concept: item.concept,
            model: props.model[key] as BaseConceptModel,
            path: [key],
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

// create a new child item in the nested has-many collection
const onCreateNestedHasManyItem = (concept: Concept) => {
    if (!nestedHasMany.value) {
        return;
    }

    const item = nestedHasMany.value.item;
    const parentKey = nestedHasMany.value.key;
    const currentModel = props.model[parentKey] as BaseConceptModel[];
    const context = {
        app: app!,
        currentModel,
        rootModel: rootModel?.value,
    };

    // call new item provider if available
    const newItem = item.newItemProvider?.(concept, context) ?? app!.createConceptInstance(concept);

    // merge the new item into the model
    const currentItemCount = currentModel.length;
    const nextModel = [...currentModel, newItem];
    const nextParentModel = { ...props.model, [parentKey]: nextModel };

    // notify the change
    emit('change', nextParentModel);

    if (!item.inline) {
        // enter nested editing if the item is not inline
        onEnterNested(parentKey, { concept, model: newItem, path: [currentItemCount] });
    }
};

const onEditNested = () => {
    // enter nested editing of a concept
    emit('enter', {
        concept: props.concept,
        model: props.model,
        path: [],
    });
};

const onClickNested = () => {
    if (props.inlineEditing) {
        // selecting
        emit('selected', { concept: props.concept, model: props.model });
    } else {
        // enter nested editing of a concept
        emit('enter', {
            concept: props.concept,
            model: props.model,
            path: [],
        });
    }
};

const onEnterNested = (parentKey: string, data: EnterConceptData) => {
    emit('enter', { ...data, path: [parentKey, ...data.path] });
};

const onChangeNested = (parentKey: string, data: BaseConceptModel[]) => {
    const nextModel = { ...props.model, [parentKey]: data };
    emit('change', nextModel);
};
</script>

<template>
    <div
        class="flex justify-between gap-1 w-full"
        :class="{
            'cursor-pointer': !inlineEditing || concept.selectable,
            'hover:bg-slate-100': !inlineEditing,
        }"
    >
        <div class="flex-grow" @click="onClickNested">
            {{ elementSummary }}
        </div>
        <el-dropdown trigger="click" v-if="model">
            <el-icon>
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
                    <el-dropdown-item @click="$emit('delete', { concept, model })"
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
            :showCreateButton="false"
            inline
            @change="(data) => onChangeNested(nestedHasMany!.key, data)"
            @enter="(data) => onEnterNested(nestedHasMany!.key, data)"
        />
    </div>

    <!-- editing entrance for 'has' items -->
    <div
        v-for="{ key, item, model } in nestedHas"
        :key="key"
        class="pt-2 pl-2 hover:bg-slate-100 cursor-pointer"
        @click="onEnterNested(key, { concept: item.concept, model, path: [] })"
    >
        {{ item.name }}
    </div>

    <!-- create button for nested has-many items -->
    <CreateCandidateButton
        v-if="nestedHasMany"
        class="mt-2"
        :name="nestedHasMany.item.name"
        :candidates="nestedHasMany.item.candidates"
        @create="onCreateNestedHasManyItem"
    />

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
