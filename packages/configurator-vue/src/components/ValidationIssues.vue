<script setup lang="ts">
import { BaseConceptModel, Concept, isConcept } from '@gaia/configurator';
import { computed } from 'vue';
import { EditPathRecord } from './types';

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
    message: string;
};

const parseIssue = (issue: Issue) => {
    const path: string[] = [];
    const conceptPath: EditPathRecord[] = [{ parentKey: [], concept: props.concept }];

    let currentModel: any = props.model;
    let currentItem: any = props.concept;
    let nextConceptPrefix: (string | number)[] = [];

    for (const part of issue.path) {
        nextConceptPrefix.push(part);
        if (typeof part === 'number') {
            currentModel = currentModel[part];
            if (currentItem.type === 'has-many' && currentModel.$concept) {
                // follow has-many relation
                const concept = currentItem.candidates.find((c: Concept) => c.name === currentModel.$concept);
                if (concept && !currentItem.inline) {
                    conceptPath.push({ parentKey: [...nextConceptPrefix], concept });
                }
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

            if (isConcept(currentItem)) {
                conceptPath.push({ parentKey: [...nextConceptPrefix], concept: currentItem });
            }

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

    return { issue, path, conceptPath };
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

const formatPath = ({ issue, path }: ParsedIssue) => {
    return `${issue.message}: ${path.join(' -> ')}`;
};

const onIssueClick = ({ conceptPath }: ParsedIssue) => {
    console.log(conceptPath);
    emit('navigate', conceptPath);
};

const issues = computed(() => props.issues.map(parseIssue));
</script>

<template>
    <ul class="flex flex-col gap-1 p-2 text-red-600 text-sm">
        <li v-for="issue in issues">
            <div class="flex items-center gap-1 cursor-pointer" @click="() => onIssueClick(issue)">
                <el-icon><i-ep-warning /></el-icon>
                <span>{{ formatPath(issue) }}</span>
            </div>
        </li>
    </ul>
</template>
