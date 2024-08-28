<script setup lang="ts">
import { composeLogicalGroupData } from '@/lib/logical-group-utils';
import type { BaseConceptModel, inferConfigItem } from '@hayadev/configurator';
import type { LogicalGroup, LogicalGroupAssociation, LogicalGroupItem } from '@hayadev/configurator/items';
import { v4 as uuid } from 'uuid';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import LogicalGroupElement from './logical-group/LogicalGroupElement.vue';

type ModelType = Array<{
    $id: string;
    groupOperator?: 'and' | 'or';
    left?: unknown;
    operator?: string;
    right?: unknown;
}>;

const props = defineProps<
    CommonProps<LogicalGroupItem> & {
        parentModel: BaseConceptModel;
    }
>();

const emit = defineEmits<CommonEvents<LogicalGroupItem>>();

const _model = ref<ModelType>(transformModel(props.model));
watch(
    () => props.model,
    (value) => {
        _model.value = transformModel(value);
    }
);

const { t } = useI18n();

function transformModel(model: inferConfigItem<LogicalGroupItem>): ModelType {
    const result: ModelType = [];
    if (model) {
        collectItem(model, result);
    }
    return result;
}

function collectItem(data: LogicalGroup, result: ModelType) {
    if (data.kind === 'expression') {
        result.push({ ...data, $id: uuid() });
    } else {
        collectAssociation(data, result);
    }
}

function collectAssociation(data: LogicalGroupAssociation, result: ModelType) {
    // collect first
    const firstItems: ModelType = [];
    collectItem(data.first, firstItems);

    // collect second
    const secondItems: ModelType = [];
    collectItem(data.second, secondItems);

    // set group operator
    if (secondItems.length > 0) {
        secondItems[0].groupOperator = data.groupOperator;
    }

    // merge
    result.push(...firstItems, ...secondItems);
}

const onAddCondition = () => {
    if (_model.value.length === 0) {
        _model.value = [{ $id: uuid() }];
    } else {
        _model.value = [..._model.value, { $id: uuid(), groupOperator: 'and' }];
    }
};

const onElementChange = (data: Omit<ModelType[number], '$id'>, id: string) => {
    const newData = _model.value.map((item) => (item.$id === id ? { ...data, $id: id } : item));
    _model.value = newData;
    emitChange();
};

const onElementDelete = (id: string) => {
    _model.value = _model.value.filter((item) => item.$id !== id);
    emitChange();
};

const emitChange = () => {
    if (_model.value.length === 0) {
        emit('change', undefined);
        return;
    }

    const groupData = composeLogicalGroupData(_model.value);

    if (groupData) {
        console.log('LogicalGroupItem ready, emitting change:', groupData);
        emit('change', groupData);
    }
};
</script>

<template>
    <div>
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" />
        <div class="flex flex-col gap-2 mt-2">
            <LogicalGroupElement
                v-for="row in _model"
                :item="props.item"
                :key="row.$id"
                :model="row"
                :parent-model="props.parentModel"
                @change="(data) => onElementChange(data, row.$id)"
                @delete="() => onElementDelete(row.$id)"
            />
            <el-button link @click="onAddCondition" class="self-start">+ {{ t('addCondition') }}</el-button>
        </div>
    </div>
</template>
