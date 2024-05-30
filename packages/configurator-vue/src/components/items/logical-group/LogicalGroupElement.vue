<script setup lang="ts">
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import {
    modelEquals,
    type AppInstance,
    type BaseConceptModel,
    type Concept,
} from '@gaia/configurator';
import type {
    LogicalGroupItem,
    LogicalLeftOperandCandidates,
    LogicalOperator,
    LogicalRightOperandCandidates,
} from '@gaia/configurator/items';
import { Ref, computed, inject, onMounted, ref } from 'vue';

type ModelType = {
    groupOperator?: 'and' | 'or';
    left?: unknown;
    operator?: string;
    right?: unknown;
};

const props = defineProps<{
    item: LogicalGroupItem;
    model: ModelType;
    parentModel: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'change', data: ModelType): void;
    (e: 'delete'): void;
}>();

const app = inject<AppInstance<Concept>>(APP_KEY);
const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

// options
const leftOperandOptions = ref<LogicalLeftOperandCandidates>();
const operatorOptions = ref<LogicalOperator[]>();
const rightOperandOptions = ref<LogicalRightOperandCandidates>();

// state
const groupOperator = ref<string | undefined>(props.model.groupOperator);
const left = ref<any>();
const right = ref<any>();
const operator = ref<string | undefined>(props.model.operator);

onMounted(async () => {
    await getLeftOperandOptions();

    if (props.model.left && leftOperandOptions.value) {
        // restore left operand from model
        left.value = leftOperandOptions.value.find((item) =>
            modelEquals(item.value, props.model.left)
        );
    }

    if (left.value) {
        await getOperator();
        if (props.model.operator && operatorOptions.value) {
            operator.value = operatorOptions.value.find((item) =>
                modelEquals(item.key, props.model.operator)
            )?.key;
        }
    }

    if (operator.value) {
        await getRightOperandOptions();

        if (props.model.right && rightOperandOptions.value) {
            if (rightOperandOptions.value.kind === 'select') {
                right.value = rightOperandOptions.value.items.find((item) =>
                    modelEquals(item.value, props.model.right)
                );
            } else {
                right.value = props.model.right;
            }
        }
    }
});

const getLeftOperandOptions = async () => {
    const items = await props.item.leftProvider({
        app: app!,
        currentModel: props.parentModel,
        rootModel: rootModel?.value,
    });
    console.log('Left options:', items);
    leftOperandOptions.value = items;
};

const getOperator = async () => {
    if (!left.value) {
        return;
    }

    const items = await props.item.operatorProvider(
        {
            app: app!,
            currentModel: props.parentModel,
            rootModel: rootModel?.value,
        },
        left.value.value
    );
    operatorOptions.value = items;
};

const getRightOperandOptions = async () => {
    if (!left.value || !operator.value) {
        return;
    }

    const operand = await props.item.rightProvider(
        {
            app: app!,
            currentModel: props.parentModel,
            rootModel: rootModel?.value,
        },
        left.value.value,
        operator.value!
    );
    console.log('Right operand:', operand);
    rightOperandOptions.value = operand;
};

const leftOperandOptionsGroups = computed(() => {
    const result: string[] = [];
    leftOperandOptions.value?.forEach((item) => {
        if (item.group && !result.includes(item.group)) {
            result.push(item.group);
        }
    });
    return result.length === 0 ? [undefined] : result;
});

const getLeftOperandOptionsByGroup = (group: string | undefined) => {
    return leftOperandOptions.value?.filter((item) => item.group === group);
};

const onLeftOperandChange = async () => {
    await getOperator();
    operator.value = undefined;
    rightOperandOptions.value = undefined;
};

const onOperatorChange = async () => {
    await getRightOperandOptions();
    if (
        rightOperandOptions.value?.kind === 'select' &&
        rightOperandOptions.value.multiple
    ) {
        right.value = [];
    } else {
        right.value = undefined;
    }

    checkEmitChange();
};

const onRightOperandChange = (value: any) => {
    right.value = value;
    checkEmitChange();
};

const checkEmitChange = () => {
    if (
        left.value &&
        operator.value &&
        (right.value || rightOperandOptions.value?.kind === 'none')
    ) {
        console.log('Logical group item ready:', {
            left: left.value,
            operator: operator.value,
            right: right.value,
        });
        emit('change', {
            groupOperator: groupOperator.value as 'and' | 'or',
            left: left.value?.value,
            operator: operator.value,
            right:
                rightOperandOptions.value?.kind === 'select'
                    ? // for select operand, the real value is wrapped inside the 'value' key
                      right.value.value
                    : right.value,
        });
    }
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-if="groupOperator" class="w-20">
            <el-select
                v-model="groupOperator"
                placeholder="请选择"
                @change="checkEmitChange"
            >
                <el-option label="并且" value="and" />
                <el-option label="或" value="or" />
            </el-select>
        </div>
        <div class="w-full flex items-center">
            <el-form class="flex flex-grow gap-1 justify-between">
                <!-- left operand -->
                <el-select
                    placeholder="请选择"
                    value-key="key"
                    v-model="left"
                    @change="onLeftOperandChange"
                >
                    <el-option-group
                        v-for="group in leftOperandOptionsGroups"
                        :label="group"
                        :key="group"
                    >
                        <el-option
                            v-for="option in getLeftOperandOptionsByGroup(
                                group
                            )"
                            :key="option.key"
                            :label="option.label"
                            :value="option"
                        />
                    </el-option-group>
                </el-select>

                <!-- operator -->
                <el-select
                    :disabled="!left"
                    :placeholder="left ? '请选择' : '--'"
                    v-model="operator"
                    @change="onOperatorChange"
                >
                    <el-option
                        v-for="option in operatorOptions"
                        :key="option.key"
                        :label="option.name"
                        :value="option.key"
                    />
                </el-select>

                <!-- right operand -->
                <el-select
                    v-if="rightOperandOptions?.kind === 'select'"
                    placeholder="请选择"
                    :multiple="rightOperandOptions?.multiple"
                    v-model="right"
                    @change="onRightOperandChange"
                >
                    <el-option
                        v-for="option in rightOperandOptions.items"
                        :key="option.key"
                        :label="option.label"
                        :value="option"
                    />
                </el-select>
                <el-input
                    v-else-if="rightOperandOptions?.kind === 'input'"
                    v-model="right"
                    @change="onRightOperandChange"
                />
                <el-select v-else disabled placeholder="--" />
            </el-form>
            <div class="ml-1">
                <el-dropdown>
                    <el-icon class="cursor-pointer">
                        <i-ep-more-filled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="$emit('delete')"
                                ><el-icon><i-ep-delete /></el-icon
                                >删除</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
