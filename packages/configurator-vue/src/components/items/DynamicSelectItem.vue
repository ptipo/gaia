<script setup lang="ts">
import { ROOT_MODEL_KEY } from '@/lib/constants';
import type { BaseConceptModel, inferConfigItem } from '@gaia/configurator';
import type {
    DynamicSelectItem,
    DynamicSelectOption,
} from '@gaia/configurator/items';
import { inject, onMounted, ref } from 'vue';
import ItemLabel from './ItemLabel.vue';

const props = defineProps<{
    item: DynamicSelectItem<any>;
    parentModel: BaseConceptModel;
    model: inferConfigItem<DynamicSelectItem<any>>;
}>();

defineEmits<{
    (e: 'change', data: inferConfigItem<DynamicSelectItem<any>>): void;
}>();

const _model = ref(props.model);

const rootModel = inject(ROOT_MODEL_KEY);

const options = ref<DynamicSelectOption<any>[]>([]);

onMounted(async () => {
    // call provider to fill in options
    const result = await props.item.provider?.({
        rootModel,
        currentModel: props.parentModel,
    });
    options.value = result;
});
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" />
        <el-select
            v-model="_model"
            placeholder="请选择"
            @change="$emit('change', _model)"
        >
            <el-option
                v-for="option in options"
                :label="option.label"
                :value="option.value"
            ></el-option>
        </el-select>
    </el-form-item>
</template>
