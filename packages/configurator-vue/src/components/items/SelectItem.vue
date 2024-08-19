<script setup lang="ts">
import { CONFIG_TRANSLATOR_KEY } from '@/lib/constants';
import { ident } from '@/lib/i18n';
import { TranslationFunction } from '@hayadev/configurator';
import type { SelectItem } from '@hayadev/configurator/items';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemLabel from './ItemLabel.vue';
import type { CommonEvents, CommonProps } from './common';

const props = defineProps<CommonProps<SelectItem>>();

const emit = defineEmits<CommonEvents<SelectItem>>();

const _model = ref(props.model);

const { t } = useI18n();
const ct = inject<TranslationFunction>(CONFIG_TRANSLATOR_KEY, ident);

const options = computed(() => {
    if (!props.item.options) {
        return [];
    }
    return Object.entries(props.item.options).map(([key, value]) => ({
        value: key,
        label: value,
    }));
});
</script>

<template>
    <el-form-item class="m-0">
        <ItemLabel :item="item" :model="props.model" :parent-model="props.parentModel" />
        <el-select v-model="_model" :placeholder="t('pleaseSelect')" @change="$emit('change', _model)">
            <el-option
                v-for="option in options"
                :key="option.value"
                :label="ct(option.label)"
                :value="option.value"
            ></el-option>
        </el-select>
    </el-form-item>
</template>
