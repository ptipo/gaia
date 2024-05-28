<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import type { BaseConceptModel, Concept, ConfigItem } from '@gaia/configurator';
import type { HasManyItem } from '@gaia/configurator/items';
import { computed, ref } from 'vue';
import { EnterConceptData } from '../types';
import HasManyItemComponent from './HasManyItem.vue';

const props = withDefaults(
    defineProps<{
        concept: Concept;
        model: BaseConceptModel;
        /**
         * Whether to enable inline editing
         */
        inlineEditing?: boolean;
    }>(),
    {
        inlineEditing: false,
    }
);

const emit = defineEmits<{
    (e: 'change', data: BaseConceptModel): void;
    (e: 'delete', data: { concept: Concept; model: BaseConceptModel }): void;
    (e: 'enter', data: EnterConceptData): void;
}>();

const showEditDialog = ref(false);
const currentEditItem = ref<{ key: string; item: ConfigItem } | undefined>();
const currentEditModel = ref<any>();

const elementSummary = computed(() => {
    if (props.concept.summary) {
        return props.concept.summary(props.model);
    }
    return props.model.name ?? props.concept.displayName ?? props.concept.name;
});

// filter items that are inline editable
const inlineEditableItems = computed(() => {
    return Object.entries(props.concept.items)
        .filter(([_, value]) =>
            ['text', 'number', 'switch'].includes(value.type)
        )
        .map(([key, value]) => ({ key, item: value }));
});

// find the first has-many child item (for inline-listing)
const nestedHasMany = computed(() => {
    const found = Object.entries(props.concept.items).find(
        ([_, item]) => item.type === 'has-many'
    );
    if (!found) {
        return undefined;
    }
    return { key: found[0], item: found[1] as HasManyItem };
});

const onEdit = (key: string, item: ConfigItem) => {
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
    <div
        class="flex justify-between"
        :class="{ 'cursor-pointer': !inlineEditing }"
        @click="onEditNested"
    >
        <div class="text-sm">
            {{ elementSummary }}
        </div>
        <el-dropdown v-if="model">
            <el-icon class="cursor-pointer">
                <i-ep-more-filled />
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu class="text-sm">
                    <div v-if="inlineEditing">
                        <el-dropdown-item
                            v-for="{ key, item } in inlineEditableItems"
                            @click="onEdit(key, item)"
                            ><el-icon><i-ep-edit /></el-icon>
                            {{ item.name }}</el-dropdown-item
                        >
                        <el-dropdown-item
                            divided
                            @click="$emit('delete', { concept, model })"
                            ><el-icon><i-ep-delete /></el-icon
                            >删除</el-dropdown-item
                        >
                    </div>
                    <div v-else>
                        <el-dropdown-item @click="onEditNested"
                            ><el-icon><i-ep-edit /></el-icon>
                            设置</el-dropdown-item
                        >
                        <el-dropdown-item
                            @click="$emit('delete', { model, concept })"
                            ><el-icon><i-ep-delete /></el-icon
                            >删除</el-dropdown-item
                        >
                    </div>
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
