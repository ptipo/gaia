<script setup lang="ts">
import { getItemComponent } from '@/lib/component';
import { CURRENT_ASPECT_KEY, DEFAULT_ASPECT } from '@/lib/constants';
import type { BaseConceptModel, Concept } from '@hayadev/configurator';
import { computed, defineAsyncComponent, inject, ref, watch, type Ref } from 'vue';
import type { EnterConceptData, SelectionData } from './types';

const props = defineProps<{
    concept: Concept;
    model: BaseConceptModel;
}>();

const _model = ref<BaseConceptModel>({ ...props.model });

watch(
    () => props.model,
    (value) => {
        _model.value = { ...value };
    }
);

const emit = defineEmits<{
    (e: 'enter', data: EnterConceptData): void;
    (e: 'change', data: BaseConceptModel): void;
    (e: 'selectionChange', data: SelectionData): void;
}>();

const currentAspect = inject<Ref<string>>(CURRENT_ASPECT_KEY);

// get groups and items belonging to the current aspect
const groups = computed(() => {
    if (!props.concept.groups) {
        return [{ key: undefined, name: '', items: getGroupItems(undefined) }];
    }

    const result: Array<{
        key: string | undefined;
        name: string;
        items: ReturnType<typeof getGroupItems>;
    }> = Object.entries(props.concept.groups)
        .filter(
            ([_, value]) =>
                value.aspect === currentAspect?.value || (!value.aspect && currentAspect?.value === DEFAULT_ASPECT)
        )
        .map(([key, value]) => ({
            key,
            name: value.name,
            items: getGroupItems(key),
        }));

    // collect ungrouped items
    result.push({ key: undefined, name: '', items: getGroupItems(undefined) });

    return result.filter((group) => group.items.length > 0);
});

const getGroupItems = (groupKey: string | undefined) => {
    return Object.entries(props.concept.items).filter(([_, item]) => {
        // ungrouped items are thrown into "content" aspect
        let itemAspect = DEFAULT_ASPECT;
        if (item.groupKey) {
            const group = props.concept.groups?.[item.groupKey];
            if (group?.aspect) {
                itemAspect = group.aspect;
            }
        }
        return item.groupKey === groupKey && itemAspect === currentAspect?.value;
    });
};

const onChange = (key: string, data: unknown) => {
    // call model change callback
    props.concept.onModelChange?.(_model.value, key, data);
    _model.value = { ..._model.value, [key]: data };
    emit('change', _model.value);
};

const onDrop = (key: string) => {
    delete _model.value[key];
    emit('change', _model.value);
};

const onEnter = (key: string, data: EnterConceptData) => {
    emit('enter', { ...data, path: [key, ...data.path] });
};

const childComponents = computed(() => {
    return Object.entries(props.concept.items).reduce((acc, [key, value]) => {
        acc[key] = getItemComponent(value);
        return acc;
    }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>);
});
</script>

<template>
    <div class="flex flex-col gap-4 pb-4">
        <div v-if="groups.length === 0" class="text-gray-500">没有该类别的配置项</div>
        <div v-for="(group, index) in groups">
            <div v-if="group.items.length > 0">
                <el-divider v-if="index > 0" class="mt-1 mb-4" />
                <div class="text-gray-500 mb-4">{{ group.name }}</div>
                <div class="flex flex-col gap-4">
                    <div v-for="[key, item] in group.items" :key="key">
                        <component
                            :is="childComponents[key]"
                            :item="item"
                            :model="_model[key]"
                            :parent-model="_model"
                            @change="(data: unknown) => onChange(key, data)"
                            @selectionChange="(data: SelectionData) => $emit('selectionChange', data)"
                            @drop="() => onDrop(key)"
                            @enter="(data: EnterConceptData) => onEnter(key, data)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
