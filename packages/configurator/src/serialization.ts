import { z } from 'zod';
import { Concept } from './concept';
import { inferConceptModel } from './inference';

type ConceptRef = { $ref: object };

export function serializeAppModel<TConcept extends Concept>(
    model: inferConceptModel<TConcept>
): string {
    const modelSchema = z.object({ $concept: z.string() }).passthrough();
    const parsed = modelSchema.parse(model);

    const conceptInstances = new Map<string, object[]>();
    const conceptRefs: ConceptRef[] = [];
    const result = visitConcept(parsed, conceptInstances, conceptRefs);

    // post-process concept refs
    conceptRefs.forEach((ref) => {
        let found = false;
        for (const [name, concepts] of conceptInstances.entries()) {
            const index = concepts.indexOf(ref.$ref);
            if (index >= 0) {
                ref.$ref = { concept: name, id: index };
                found = true;
            }
            if (found) {
                break;
            }
        }
        if (!found) {
            throw new Error(`Unresolved concept reference: ${ref.$ref}`);
        }
    });

    return JSON.stringify({
        meta: { conceptInstances },
        concept: result,
    });
}

function visitConcept(
    concept: { $concept: string } & Record<string, unknown>,
    conceptInstances: Map<string, object[]>,
    conceptRefs: ConceptRef[]
) {
    const { $concept, ...items } = concept;

    addConceptInstance(conceptInstances, concept);

    for (const [key, item] of Object.entries(items)) {
        items[key] = visitConfigItem(item, conceptInstances, conceptRefs);
    }

    return concept;
}

function addConceptInstance(
    conceptInstances: Map<string, object[]>,
    concept: { $concept: string } & Record<string, unknown>
) {
    let currentInstances = conceptInstances.get(concept.$concept);
    if (!currentInstances) {
        currentInstances = [];
        conceptInstances.set(concept.$concept, currentInstances);
    }
    currentInstances.push(concept);
}

function visitConfigItem(
    item: unknown,
    conceptInstances: Map<string, object[]>,
    conceptRefs: ConceptRef[]
) {
    if (typeof item === 'object' && item) {
        if ('$ref' in item) {
            // concept reference
            conceptRefs.push(item as ConceptRef);
            return item;
        }

        if ('$concept' in item) {
            // concept
            addConceptInstance(conceptInstances, item as { $concept: string });
        }
    }

    if (item && typeof item === 'object') {
        for (const [subKey, subItem] of Object.entries(item)) {
            (item as Record<string, unknown>)[subKey] = visitConfigItem(
                subItem,
                conceptInstances,
                conceptRefs
            );
        }
    }

    return item;
}

export function deserializeAppModel(serialized: string): object {
    throw new Error('Not implemented');
}
