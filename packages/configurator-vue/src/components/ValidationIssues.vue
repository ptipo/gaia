<script setup lang="ts">
import { BaseConceptModel, Concept, ValidationIssueCode } from '@hayadev/configurator';
import { match } from 'ts-pattern';
import { computed } from 'vue';
import type { EditPathRecord } from './types';

const props = defineProps<{
    issues: Issue[];
    concept: Concept;
    model: BaseConceptModel;
}>();

const emit = defineEmits<{
    (e: 'navigate', data: EditPathRecord[]): void;
}>();

export type Issue = {
    path: (string | number)[];
    code: ValidationIssueCode;
    message: string;
};

const parseIssue = (issue: Issue) => {
    const path: string[] = [];

    let currentModel: any = props.model;
    let currentItem: any = props.concept;

    for (const part of issue.path) {
        if (typeof part === 'number') {
            currentModel = currentModel[part];
            if (currentItem.type === 'has-many' && currentModel.$concept) {
                // follow has-many relation
                const concept = currentItem.candidates.find((c: Concept) => c.name === currentModel.$concept);
                currentItem = concept;
            } else {
                currentItem = undefined;
            }

            if (currentModel) {
                path.push(currentModel.name ?? `#${part + 1}`);
            }
        } else {
            currentModel = currentModel[part];
            currentItem = unwrap(currentItem?.items?.[part]);

            if (currentModel?.name) {
                path.push(currentModel.name);
            } else if (currentItem?.name) {
                path.push(currentItem.name);
            }
        }

        if (!currentModel || !currentItem) {
            break;
        }
    }

    return { issue, path };
};

const unwrap = (item: any) => {
    if (!item) {
        return item;
    }
    if (item.type === 'has') {
        // follow has relation
        return item.concept;
    } else if (item.type === 'if') {
        // follow if's child
        return item.child;
    }
    return item;
};

type ParsedIssue = ReturnType<typeof parseIssue>;

const getIssueCodeName = (code: ValidationIssueCode) => {
    return match(code)
        .with(ValidationIssueCode.Required, () => '未设置')
        .with(ValidationIssueCode.RequiredArray, () => '未设置')
        .with(ValidationIssueCode.InvalidValue, () => '设置错误')
        .exhaustive();
};

const formatPath = ({ issue, path }: ParsedIssue) => {
    return `${getIssueCodeName(issue.code)}: ${path.join(' > ')}`;
};

const onIssueClick = ({ issue }: ParsedIssue) => {
    emit('navigate', issue.path);
};

const issues = computed(() => props.issues.map(parseIssue));
</script>

<template>
    <ul class="flex flex-col">
        <li v-for="(issue, i) in issues">
            <el-divider v-if="i > 0" style="margin: 12px 0" />
            <div class="cursor-pointer" @click="() => onIssueClick(issue)">
                {{ formatPath(issue) }}
            </div>
        </li>
    </ul>
</template>
