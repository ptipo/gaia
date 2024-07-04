<script setup lang="ts">
import DragAnchor from '@/assets/icon/drag-anchor.svg';
import { getItemComponent } from '@/lib/component';
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import type { AppInstance, BaseConceptModel, Concept, ConfigItem } from '@hayadev/configurator';
import type { HasManyItem } from '@hayadev/configurator/items';
import type { DropdownInstance } from 'element-plus';
import { Ref, computed, inject, ref, watch } from 'vue';
import type { ConceptModelPair, EnterConceptData } from '../types';
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
         * The parent "has-many" item
         */
        parent: HasManyItem;

        /**
         * Whether to enable inline editing
         */
        inlineEditing?: boolean;

        /**
         * Whether to allow delete
         */
        allowDelete?: boolean;

        /**
         * Whether to allow clone
         */
        allowClone?: boolean;

        /**
         * Whether to allow add sibling
         */
        allowAddSibling?: boolean;
    }>(),
    {
        inlineEditing: false,
        allowDelete: true,
        allowClone: true,
        allowAddSibling: true,
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

// mutable model
const _model = ref<BaseConceptModel>({ ...props.model });

// showing secondary-level menu
const showCandidateCreateMenu = ref(false);

const menuEl = ref<DropdownInstance>();

// track prop changes
watch(
    () => props.model,
    (value) => {
        _model.value = { ...value };
    }
);

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
        .filter(([_, item]) => !['has-many', 'has'].includes(item.type) && !item.inline)
        .map(([key, item]) => ({ key, item }));
});

// find the first has-many child item (for inline-listing)
const nestedHasMany = computed(() => {
    const found = Object.entries(props.concept.items).find(([_, item]) => item.type === 'has-many');
    if (!found) {
        return undefined;
    }
    return { key: found[0], item: found[1] as HasManyItem };
});

// items that should be displayed inline
const inlineItems = computed(() => {
    return Object.entries(props.concept.items)
        .filter(([_, item]) => item.inline)
        .map(([key, item]) => ({ key, item, model: props.model[key] as BaseConceptModel }));
});

const onEdit = (key: string, item: ConfigItem) => {
    if (item.type === 'has') {
        // enter editing of a nested concept
        emit('enter', {
            concept: item.concept,
            model: _model.value[key] as BaseConceptModel,
            path: [key],
        });
        return;
    }

    // pop up the edit dialog
    currentEditItem.value = { key, item };
    currentEditModel.value = _model.value[key];
    showEditDialog.value = true;
};

const onCurrentEditChange = (data: any) => {
    currentEditModel.value = data;
};

const onSaveEdit = () => {
    if (currentEditItem.value) {
        _model.value[currentEditItem.value!.key] = currentEditModel.value;
        emitChange();
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
    const currentModel = _model.value[parentKey] as BaseConceptModel[];
    const currentModelLength = currentModel.length;
    const context = {
        app: app!,
        currentModel,
        rootModel: rootModel?.value,
    };

    // call new item provider if available
    const newItem = item.newItemProvider?.(concept, context) ?? app!.createConceptInstance(concept);

    // merge the new item into the model
    _model.value[parentKey] = [...currentModel, newItem];

    // notify the change
    emitChange();

    if (!item.inline) {
        // enter nested editing if the item is not inline
        onEnterNested(parentKey, { concept, model: newItem, path: [currentModelLength] });
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
    closeMenu();
    emit('enter', { ...data, path: [parentKey, ...data.path] });
    emit('selected', { concept: props.concept, model: props.model });
};

const onChangeNested = (parentKey: string, data: BaseConceptModel[]) => {
    _model.value[parentKey] = data;
    emitChange();
};

const onClone = (data: ConceptModelPair) => {
    closeMenu();
    emit('clone', data);
};

const onDelete = (data: ConceptModelPair) => {
    closeMenu();
    emit('delete', data);
};

const onAddSibling = (concept: Concept) => {
    closeMenu();
    emit('addSibling', { concept, model: props.model });
};

const emitChange = () => {
    emit('change', _model.value);
};

const closeMenu = () => {
    menuEl.value?.handleClose();
    showCandidateCreateMenu.value = false;
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <div
            class="flex justify-between gap-1 w-full group"
            :class="{
                'cursor-pointer': !inlineEditing || concept.selectable,
                'hover:bg-slate-100': !inlineEditing,
            }"
        >
            <div class="flex-grow" @click="onClickNested">
                <span v-if="elementSummary">{{ elementSummary }}</span
                ><span v-else class="italic text-gray-600">未命名</span>
            </div>
            <el-dropdown
                trigger="click"
                v-if="model"
                ref="menuEl"
                :hide-on-click="false"
                @visible-change="
                    () => {
                        showCandidateCreateMenu = false;
                    }
                "
            >
                <el-icon class="hidden group-hover:block">
                    <el-tooltip content="拖拽移动，点击打开菜单" placement="top" :show-after="600">
                        <img class="handle" :src="DragAnchor" />
                    </el-tooltip>
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <template v-if="!showCandidateCreateMenu">
                            <div v-if="inlineEditing">
                                <el-dropdown-item
                                    v-for="{ key, item } in inlineEditableItems"
                                    @click="onEdit(key, item)"
                                    ><el-icon><i-ep-edit /></el-icon> {{ item.name }}</el-dropdown-item
                                >
                            </div>
                            <div v-else>
                                <el-dropdown-item @click="onEditNested"
                                    ><el-icon><i-ep-edit /></el-icon> 设置</el-dropdown-item
                                >
                            </div>
                            <el-dropdown-item
                                v-if="parent.candidates.length === 1"
                                :disabled="!allowAddSibling"
                                @click="() => onAddSibling(parent.candidates[0])"
                                ><el-icon><i-ep-plus /></el-icon>在下方添加{{
                                    parent.candidates.length === 1 ? concept.displayName : parent.name
                                }}</el-dropdown-item
                            >
                            <el-dropdown-item
                                v-else
                                divided
                                :disabled="!allowAddSibling"
                                @click="
                                    () => {
                                        showCandidateCreateMenu = true;
                                    }
                                "
                                ><el-icon><i-ep-plus /></el-icon>在下方添加{{
                                    parent.candidates.length === 1 ? concept.displayName : parent.name
                                }}</el-dropdown-item
                            >

                            <el-dropdown-item divided :disabled="!allowClone" @click="() => onClone({ concept, model })"
                                ><el-icon><i-ep-document-copy /></el-icon>复制</el-dropdown-item
                            >
                            <el-dropdown-item @click="() => onDelete({ concept, model })"
                                ><el-icon><i-ep-delete /></el-icon>删除</el-dropdown-item
                            >
                        </template>
                        <!-- showing candidate create menu items -->
                        <template v-else>
                            <el-dropdown-item
                                v-for="candidate in parent.candidates"
                                :key="candidate.name"
                                @click="() => onAddSibling(candidate)"
                            >
                                {{ candidate.displayName ?? candidate.name }}
                            </el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <!-- inline listing has-many -->
        <HasManyItemComponent
            class="pl-2"
            v-if="nestedHasMany"
            :item="nestedHasMany.item"
            :parent-model="props.model"
            :model="props.model[nestedHasMany.key] as BaseConceptModel[]"
            :showCreateButton="false"
            inline
            @change="(data) => onChangeNested(nestedHasMany!.key, data)"
            @enter="(data) => onEnterNested(nestedHasMany!.key, data)"
        />

        <!-- inline listing other items -->
        <component
            v-for="{ key, item, model: itemModel } in inlineItems"
            class="pl-2"
            :key="key"
            :is="getItemComponent(item)"
            :item="item"
            :model="itemModel"
            :parent-model="model"
            @change="(data: any) => onChangeNested(key, data)"
            @enter="(data: any) => onEnterNested(key, data)"
        ></component>

        <!-- create button for nested has-many items -->
        <CreateCandidateButton
            v-if="nestedHasMany"
            :name="nestedHasMany.item.name"
            :candidates="nestedHasMany.item.candidates"
            @create="onCreateNestedHasManyItem"
        />
        <!-- inline-editing dialog -->
        <el-dialog
            v-model="showEditDialog"
            v-if="currentEditItem"
            :title="`修改${currentEditItem.item.name}`"
            width="500"
        >
            <component
                :is="getItemComponent(currentEditItem.item)"
                :item="currentEditItem.item"
                :model="currentEditModel"
                :parent-model="model"
                @change="(data: any) => onCurrentEditChange(data)"
            ></component>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="onCancelEdit">取消</el-button>
                    <el-button type="primary" @click="onSaveEdit">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
