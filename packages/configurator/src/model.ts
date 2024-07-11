import deepcopy from 'deepcopy';
import { v4 as uuid } from 'uuid';
import { BaseConceptModel } from '.';
import { NonPrimitiveTypes } from './types';

/**
 * Checks if the given data is a concept instance.
 */
export function isConceptInstance(data: unknown): data is BaseConceptModel {
    return (
        !!data &&
        typeof data === 'object' &&
        '$type' in data &&
        data.$type === NonPrimitiveTypes.concept &&
        '$concept' in data &&
        typeof data.$concept === 'string'
    );
}

/**
 * Reference to a concept instance.
 */
export type ConceptRef = {
    $type: NonPrimitiveTypes.ref;
    $concept: string;
    $id: string;
};

/**
 * Creates a reference to a concept instance.
 */
export function createRef(instance: BaseConceptModel): ConceptRef {
    return {
        $type: NonPrimitiveTypes.ref,
        $concept: instance.$concept,
        $id: instance.$id,
    };
}

/**
 * Checks if the given data is a concept reference.
 */
export function isConceptRef(value: unknown): value is ConceptRef {
    return (
        !!value &&
        typeof value === 'object' &&
        '$type' in value &&
        value.$type === NonPrimitiveTypes.ref &&
        '$concept' in value &&
        typeof value.$concept === 'string' &&
        '$id' in value &&
        typeof value.$id === 'string'
    );
}

/**
 * Checks if the given two values are equal.
 */
export function modelEquals(x: unknown, y: unknown) {
    if (x === y) {
        return true;
    }
    if (isConceptRef(x) && isConceptRef(y)) {
        return x.$concept === y.$concept && x.$id === y.$id;
    }
    return false;
}

/**
 * Clones a concept model. Replacing all ids with new ones.
 */
export function cloneConceptModel<T extends BaseConceptModel>(model: T) {
    const idMapping = new Map<string, string>();
    const result = doCloneConceptModel(model, idMapping);

    // make another visit pass to replace concept references with new ids
    updateConceptRefs(result, idMapping);

    return result as T;
}

function doCloneConceptModel<T extends BaseConceptModel>(model: T, idMapping: Map<string, string>) {
    const result: any = { $id: uuid() };
    idMapping.set(model.$id, result.$id);

    for (const [key, value] of Object.entries(model)) {
        if (key === '$id') {
            continue;
        }
        if (Array.isArray(value)) {
            result[key] = value.map((item) => {
                if (isConceptInstance(item)) {
                    return doCloneConceptModel(item, idMapping);
                }
                return deepcopy(item);
            });
        } else if (isConceptInstance(value)) {
            result[key] = doCloneConceptModel(value, idMapping);
        } else {
            result[key] = deepcopy(value);
        }
    }

    return result;
}

function updateConceptRefs(model: object, idMapping: Map<string, string>, seenObjects = new Set()) {
    if (!model || seenObjects.has(model)) {
        return;
    }

    seenObjects.add(model);

    for (const value of Object.values(model)) {
        if (isConceptRef(value)) {
            const newId = idMapping.get(value.$id);
            if (newId) {
                value.$id = newId;
            } else {
                console.error(`Cannot resolve concept reference ${value.$id}`);
            }
        } else if (Array.isArray(value)) {
            for (const item of value) {
                if (item && typeof item === 'object') {
                    updateConceptRefs(item, idMapping, seenObjects);
                }
            }
        } else if (value && typeof value === 'object') {
            updateConceptRefs(value, idMapping, seenObjects);
        }
    }
}
