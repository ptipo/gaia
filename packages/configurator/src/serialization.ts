import { z } from 'zod';
import { Concept } from './concept';
import { inferConceptModel } from './inference';
import { NonPrimitiveTypes } from './types';

export function serializeAppModel<TConcept extends Concept>(
    model: inferConceptModel<TConcept>
): string {
    const modelSchema = z.object({ $concept: z.string() }).passthrough();
    const parsed = modelSchema.parse(model);

    const conceptInstances = new Map<string, object[]>();
    const processed = visitConcept(parsed, conceptInstances);
    return JSON.stringify({ conceptInstances, concept: processed });
}

function visit(
    value: unknown,
    conceptInstances: Map<string, object[]>
): unknown {
    if (!value) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => visit(item, conceptInstances));
    }

    if (isConceptInstance(value)) {
        return visitConcept(value, conceptInstances);
    }

    if (typeof value === 'object' && !isPrimitive(value)) {
        // recurse into object
        for (const [key, item] of Object.entries(value)) {
            (value as any)[key] = visit(item, conceptInstances);
        }
        return value;
    }

    return value;
}

function visitConcept(value: object, conceptInstances: Map<string, object[]>) {
    const schema = z.object({ $concept: z.string() }).passthrough();
    const concept = schema.parse(value);
    const id = internalizeConceptInstance(
        concept.$concept,
        value,
        conceptInstances
    );
    return { $concept: concept.$concept, $id: id };
}

function internalizeConceptInstance(
    concept: string,
    value: object,
    conceptInstances: Map<string, object[]>
) {
    let currentInstances = conceptInstances.get(concept);
    if (!currentInstances) {
        currentInstances = [];
        conceptInstances.set(concept, currentInstances);
    }
    const index = currentInstances.indexOf(value);
    if (index >= 0) {
        return index;
    } else {
        currentInstances.push(value);
        for (const [key, item] of Object.entries(value)) {
            if (key.startsWith('$')) {
                continue;
            }
            (value as any)[key] = visit(item, conceptInstances);
        }
        return currentInstances.length - 1;
    }
}

export function deserializeAppModel(serialized: string): object {
    return JSON.parse(serialized);
}

function isPrimitive(value: object) {
    return value instanceof Date;
}

function isConceptInstance(value: unknown): value is { $concept: string } {
    return (
        typeof value === 'object' &&
        !!value &&
        '$type' in value &&
        value.$type === NonPrimitiveTypes.concept &&
        '$concept' in value &&
        typeof value.$concept === 'string'
    );
}
