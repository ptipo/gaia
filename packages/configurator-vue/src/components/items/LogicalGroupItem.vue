<script setup lang="ts">
import type { BaseConceptModel, inferConfigItem } from '@gaia/configurator';
import { type LogicalGroupItem } from '@gaia/configurator/items';
import { createId } from '@paralleldrive/cuid2';
import { ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import LogicalGroupElement from './logical-group/LogicalGroupElement.vue';

type ModelType = Array<{
    $id: string;
    groupOperator?: 'and' | 'or';
    left?: unknown;
    operator?: string;
    right?: unknown;
}>;

const props = defineProps<{
    item: LogicalGroupItem;
    model: inferConfigItem<LogicalGroupItem>;
    parentModel: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'change', data: inferConfigItem<LogicalGroupItem> | undefined): void;
}>();

const _model = ref<ModelType>(transformModel(props.model));

function transformModel(model: inferConfigItem<LogicalGroupItem>): ModelType {
    const result: ModelType = [];

    if (!model) {
        return result;
    }

    let current = model;

    while (current) {
        if (!('groupOperator' in current)) {
            result.push({ ...current, $id: createId() });
            break;
        } else {
            result.push({
                $id: createId(),
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
        _model.value = [{ $id: createId() }];
    } else {
        _model.value = [
            ..._model.value,
            { $id: createId(), groupOperator: 'and' },
        ];
    }
};

const onElementChange = (data: Omit<ModelType[number], '$id'>, id: string) => {
    const newData = _model.value.map((item) =>
        item.$id === id ? { ...data, $id: id } : item
    );
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

    let groupData: inferConfigItem<LogicalGroupItem> | undefined = undefined;

    for (let i = 0; i < _model.value.length; i++) {
        const row = _model.value[i];
        if (!row.left || !row.operator) {
            groupData = undefined;
            break;
        }

        if (i !== 0 && !row.groupOperator) {
            groupData = undefined;
            break;
        }

        if (i === 0) {
            groupData = {
                left: row.left,
                operator: row.operator,
                right: row.right,
            };
        } else {
            groupData = {
                groupOperator: row.groupOperator!,
                first: groupData!,
                second: {
                    left: row.left,
                    operator: row.operator,
                    right: row.right,
                },
            };
        }
    }

    if (groupData) {
        console.log('LogicalGroupItem ready, emitting change:', groupData);
        emit('change', groupData);
    }
};
</script>

<template>
    <div>
        <ItemLabel :item="item" />
        <div class="flex flex-col gap-2">
            <LogicalGroupElement
                v-for="row in _model"
                :item="props.item"
                :key="row.$id"
                :model="row"
                :parentModel="props.parentModel"
                @change="(data) => onElementChange(data, row.$id)"
                @delete="() => onElementDelete(row.$id)"
            />
            <el-button link @click="onAddCondition" class="self-start"
                >+ 添加条件</el-button
            >
        </div>
    </div>
</template>
