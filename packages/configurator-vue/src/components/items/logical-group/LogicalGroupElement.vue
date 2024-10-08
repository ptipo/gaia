<script setup lang="ts">
import { APP_KEY, CONFIG_TRANSLATOR_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { ident } from '@/lib/i18n';
import {
    modelEquals,
    TranslationFunction,
    type AppInstance,
    type BaseConceptModel,
    type Concept,
} from '@hayadev/configurator';
import type {
    LogicalGroupItem,
    LogicalLeftOperandCandidates,
    LogicalOperator,
    LogicalRightOperandCandidates,
} from '@hayadev/configurator/items';
import { Ref, computed, inject, onMounted, ref, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n();

const ct = inject<TranslationFunction>(CONFIG_TRANSLATOR_KEY, ident);

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
    await refreshState();
});

watch(
    () => props.model,
    async () => {
        await refreshState();
    }
);

const refreshState = async () => {
    left.value = undefined;
    operator.value = undefined;
    right.value = undefined;

    await getLeftOperandOptions();

    if (props.model.left && leftOperandOptions.value) {
        // restore left operand from model
        left.value = leftOperandOptions.value.find((item) => modelEquals(item.value, props.model.left));
    }

    if (left.value) {
        await getOperator();
        if (props.model.operator && operatorOptions.value) {
            operator.value = operatorOptions.value.find((item) => modelEquals(item.key, props.model.operator))?.key;
        }
    }

    if (operator.value) {
        await getRightOperandOptions();

        if (props.model.right && rightOperandOptions.value) {
            if (rightOperandOptions.value.kind === 'select') {
                if (rightOperandOptions.value.multiple) {
                    let arr: any[];
                    if (!Array.isArray(props.model.right)) {
                        arr = [props.model.right];
                    } else {
                        arr = props.model.right as any[];
                    }
                    // filter items in the right operand options
                    right.value = rightOperandOptions.value.items.filter((item) =>
                        arr.some((v) => modelEquals(v, item.value))
                    );
                } else {
                    // find the item in the right operand options
                    right.value = rightOperandOptions.value.items.find((item) =>
                        modelEquals(item.value, props.model.right)
                    );
                }
            } else {
                right.value = props.model.right;
            }
        }
    }
};

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
            ct: unref(ct),
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
            ct: unref(ct),
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
    if (rightOperandOptions.value?.kind === 'select' && rightOperandOptions.value.multiple) {
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
    if (left.value && operator.value && (right.value || rightOperandOptions.value?.kind === 'none')) {
        let rightValue: any;
        if (rightOperandOptions.value?.kind === 'select') {
            if (rightOperandOptions.value.multiple) {
                // right value is the value nested inside select option array
                rightValue = right.value.map((item: any) => item.value);
            } else {
                // right value is the value nested inside select option
                rightValue = right.value.value;
            }
        } else {
            // right value is input's value
            rightValue = right.value;
        }

        const emitData = {
            groupOperator: groupOperator.value as 'and' | 'or',
            left: left.value?.value,
            operator: operator.value,
            right: rightValue,
        };
        console.log('Logical group item ready:', emitData);
        emit('change', emitData);
    }
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-if="groupOperator" class="w-20">
            <el-select v-model="groupOperator" :placeholder="t('pleaseSelect')" @change="checkEmitChange">
                <el-option :label="t('and')" value="and" />
                <el-option :label="t('or')" value="or" />
            </el-select>
        </div>
        <div class="w-full flex items-center">
            <el-form class="flex flex-grow gap-1 justify-between">
                <!-- left operand -->
                <el-select
                    :placeholder="t('pleaseSelect')"
                    value-key="key"
                    v-model="left"
                    @change="onLeftOperandChange"
                >
                    <el-option-group v-for="group in leftOperandOptionsGroups" :label="group" :key="group">
                        <el-option
                            v-for="option in getLeftOperandOptionsByGroup(group)"
                            :key="option.key"
                            :label="option.label"
                            :value="option"
                        />
                    </el-option-group>
                </el-select>

                <!-- operator -->
                <el-select
                    :disabled="!left"
                    :placeholder="left ? t('pleaseSelect') : '--'"
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
                    :placeholder="t('pleaseSelect')"
                    :multiple="rightOperandOptions?.multiple"
                    v-model="right"
                    value-key="key"
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
                <el-dropdown trigger="click">
                    <el-icon class="cursor-pointer">
                        <i-ep-more-filled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="$emit('delete')"
                                ><el-icon><i-ep-delete /></el-icon>{{ t('delete') }}</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
