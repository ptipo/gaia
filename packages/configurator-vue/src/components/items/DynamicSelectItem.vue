<script setup lang="ts">
import { APP_KEY, ROOT_MODEL_KEY } from '@/lib/constants';
import { modelEquals, type AppInstance, type BaseConceptModel, type Concept } from '@hayadev/configurator';
import type { DynamicSelectItem, DynamicSelectOption } from '@hayadev/configurator/items';
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
    onSetOff: () => {
        emit('drop');
        _model.value = undefined;
    },
});

const fillOptions = async () => {
    // call provider to fill in options
    const result = await props.item.provider?.({
        app: app!,
        rootModel: rootModel?.value,
        currentModel: props.parentModel,
    });

    if (!Array.isArray(result)) {
        return;
    }

    options.value = result;

    // update model
    if (_model.value === undefined || (Array.isArray(_model.value) && _model.value.length === 0)) {
        if (props.item.multiple) {
            if (props.item.allowCreate) {
                // just use the model as is
                _model.value = props.model;
            } else if (Array.isArray(props.model)) {
                // filter the model with options
                _model.value = props.model.filter((item) => result.some((option) => modelEquals(item, option.value)));
            }
        } else {
            // find the option that matches the model
            _model.value = result.find((option) => modelEquals(option.value, props.model));
        }
    }
};

onMounted(async () => {
    await fillOptions();
});

watch([rootModel], async () => {
    await fillOptions();
});

const onChange = (data: any) => {
    let emitData = data;

    if (props.item.multiple) {
        // expect array
        if (Array.isArray(emitData)) {
            // deal with user-created and provided options: user-created options are plain strings,
            // while provided options are objects
            emitData = emitData.map((e) => (typeof e === 'object' ? e.value : e));
            emit('change', emitData);
        }
    } else {
        if (typeof emitData === 'object') {
            emitData = emitData.value;
        }
        emit('change', emitData);
    }
};
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" v-model:enabled="enabled" />
        <el-select
            v-if="!item.guarded || enabled"
            v-model="_model"
            :multiple="item.multiple"
            :allow-create="item.allowCreate"
            default-first-option
            filterable
            :reserve-keyword="false"
            placeholder="请选择"
            value-key="key"
            @change="onChange"
        >
            <el-option v-for="option in options" :key="option.key" :label="option.label" :value="option" />
        </el-select>
    </el-form-item>
</template>
