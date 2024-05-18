import { z } from 'zod';
import { Concept } from './concept';
import { ConfigItem, getConfigItemSchema } from './config-item';

export function getConceptSchema<TConcept extends Concept>(
    concept: TConcept
): z.ZodObject<z.ZodRawShape> {
    return z.object({
        ...mapConfigItems(concept.items),
        $concept: z.string(),
    });
}

function mapConfigItems(items: Record<string, ConfigItem>) {
    return Object.entries(items).reduce(
        (acc, [key, item]) => ({
            ...acc,
            [key]: getConfigItemSchema(item),
        }),
        {}
    );
}
