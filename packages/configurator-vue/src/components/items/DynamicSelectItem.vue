<script setup lang="ts">
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import {
    modelEquals,
    type AppInstance,
    type BaseConceptModel,
    type Concept,
} from '@gaia/configurator';
import type {
    DynamicSelectItem,
    DynamicSelectOption,
} from '@gaia/configurator/items';
import { inject, onMounted, ref, watch, type Ref } from 'vue';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';
import { useGuard } from './guard';

const props = defineProps<
    CommonProps<DynamicSelectItem<any>> & {
        parentModel: BaseConceptModel;
    }
>();

const emit = defineEmits<CommonEvents<DynamicSelectItem<any>>>();

const _model = ref();

const app = inject<AppInstance<Concept>>(APP_KEY);

const rootModel = inject<Ref<BaseConceptModel>>(ROOT_MODEL_KEY);

const options = ref<DynamicSelectOption<any>[]>([]);

const { enabled } = useGuard(props.model !== undefined, {
    onSetOff: () => emit('change', undefined),
});

const fillOptions = async () => {
    // call provider to fill in options
    const result = await props.item.provider?.({
        app: app!,
        rootModel: rootModel?.value,
        currentModel: props.parentModel,
    });
    options.value = result;

    // update model
    if (_model.value === undefined) {
        _model.value = result.find((option) =>
            modelEquals(option.value, props.model)
        );
    }
};

onMounted(async () => {
    await fillOptions();
});

watch([rootModel], async () => {
    await fillOptions();
});
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" v-model="enabled" />
        <el-select
            v-if="enabled"
            v-model="_model"
            placeholder="请选择"
            value-key="key"
            @change="(option) => emit('change', option.value)"
        >
            <el-option
                v-for="option in options"
                :key="option.key"
                :label="option.label"
                :value="option"
            />
        </el-select>
    </el-form-item>
</template>
