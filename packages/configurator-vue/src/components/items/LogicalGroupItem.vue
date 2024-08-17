<script setup lang="ts">
import type { BaseConceptModel, inferConfigItem } from '@hayadev/configurator';
import { type LogicalGroupItem } from '@hayadev/configurator/items';
import { v4 as uuid } from 'uuid';
import { ref, watch } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import LogicalGroupElement from './logical-group/LogicalGroupElement.vue';
import { composeLogicalGroupData } from '@/lib/logical-group-utils';
import { useI18n } from 'vue-i18n';

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

    if (!model) {
        return result;
    }

    let current = model;

    while (current) {
        if (!('groupOperator' in current)) {
            result.push({ ...current, $id: uuid() });
            break;
        } else {
            result.push({
                $id: uuid(),
                ...current.second,
                groupOperator: current.groupOperator,
            });
            current = current.first;
        }
    }

    return result.reverse();
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
