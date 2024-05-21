import { z } from 'zod';
import { Concept } from './concept';
import {
    BaseConceptModel,
    inferConcept,
    inferPartialConcept,
} from './inference';
import { NonPrimitiveTypes } from './types';

type ConceptRef = { $concept: string; $id: number };

/**
 * 序列化应用模型
 */
export function serializeAppModel<TConcept extends Concept>(
    model: inferPartialConcept<TConcept>
) {
    const conceptInstances: Record<string, object[]> = {};
    const processed = serializeConcept(model, conceptInstances);
    return JSON.stringify({
        conceptInstances,
        data: processed,
    });
}

/**
 * 反序列化应用模型
 */
export function deserializeAppModel<TConcept extends Concept>(
    serialized: string
): inferPartialConcept<TConcept> {
    const deserialized = JSON.parse(serialized);
    const parsed = z.object({
        conceptInstances: z.record(
            z.array(
                z
                    .object({
                        $type: z.literal(NonPrimitiveTypes.concept),
                        $concept: z.string(),
                    })
                    .passthrough()
            )
        ),
        data: z.object({
            $concept: z.string(),
            $id: z.number().int().nonnegative(),
        }),
    });

    const { conceptInstances, data } = parsed.parse(deserialized);
    return deserializeConcept(
        data,
        conceptInstances
    ) as inferPartialConcept<TConcept>;
}

function serializeConcept(
    value: object,
    conceptInstances: Record<string, object[]>
): ConceptRef {
    const schema = z.object({ $concept: z.string() }).passthrough();
    const concept = schema.parse(value);

    // internalize concept

    let currentInstances = conceptInstances[concept.$concept];
    if (!currentInstances) {
        currentInstances = [];
        conceptInstances[concept.$concept] = currentInstances;
    }

    const index = currentInstances.indexOf(value);

    if (index >= 0) {
        return { $concept: concept.$concept, $id: index };
    } else {
        currentInstances.push(value);
        const id = currentInstances.length - 1;
        for (const [key, item] of Object.entries(value)) {
            if (key.startsWith('$')) {
                continue;
            }
            (value as any)[key] = serializeItem(item, conceptInstances);
        }
        return { $concept: concept.$concept, $id: id };
    }
}

function serializeItem(
    value: unknown,
    conceptInstances: Record<string, object[]>
): unknown {
    if (!value) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => serializeItem(item, conceptInstances));
    }

    if (isConceptInstance(value)) {
        return serializeConcept(value, conceptInstances);
    }

    if (typeof value === 'object' && !isPrimitive(value)) {
        // recurse into object
        for (const [key, item] of Object.entries(value)) {
            (value as any)[key] = serializeItem(item, conceptInstances);
        }
        return value;
    }

    return value;
}

function deserializeConcept(
    data: ConceptRef,
    conceptInstances: Record<string, object[]>
): inferConcept<Concept> {
    const instances = conceptInstances[data.$concept];
    if (!instances) {
        throw new Error(`Unknown concept: ${data.$concept}`);
    }

    const instance = instances[data.$id];
    if (!instance) {
        throw new Error(
            `Unknown concept instance: ${data.$concept}#${data.$id}`
        );
    }

    const result: inferConcept<Concept> = {
        $type: NonPrimitiveTypes.concept,
        $concept: data.$concept,
    };

    for (const [key, item] of Object.entries(instance)) {
        result[key] = deserializeItem(item, conceptInstances);
    }

    return result;
}

function deserializeItem(
    value: unknown,
    conceptInstances: Record<string, object[]>
): unknown {
    if (!value) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deserializeItem(item, conceptInstances));
    }

    if (isConceptRef(value)) {
        return deserializeConcept(value, conceptInstances);
    }

    if (typeof value === 'object' && !isPrimitive(value)) {
        // recurse into object
        for (const [key, item] of Object.entries(value)) {
            (value as any)[key] = deserializeItem(item, conceptInstances);
        }
        return value;
    }

    return value;
}

function isPrimitive(value: object) {
    return value instanceof Date;
}

function isConceptInstance(value: unknown): value is BaseConceptModel {
    return (
        typeof value === 'object' &&
        !!value &&
        '$type' in value &&
        value.$type === NonPrimitiveTypes.concept &&
        '$concept' in value &&
        typeof value.$concept === 'string'
    );
}

function isConceptRef(value: unknown): value is ConceptRef {
    return (
        !!value &&
        typeof value === 'object' &&
        '$concept' in value &&
        typeof value.$concept === 'string' &&
        '$id' in value &&
        typeof value.$id === 'number'
    );
}
