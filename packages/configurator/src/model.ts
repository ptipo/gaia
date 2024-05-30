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
