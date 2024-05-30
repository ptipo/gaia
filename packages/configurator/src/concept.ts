import { z } from 'zod';
import { ConfigItem, getConfigItemSchema } from './config-item';
import { NonPrimitiveTypes, ProviderContext } from './types';

/**
 * A configurable abstract concept containing a set of config items.
 */
export type Concept<
    TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>
> = {
    /**
     * Concept name
     */
    name: string;

    /**
     * Display name
     */
    displayName: string;

    /**
     * Grouping information
     */
    groups?: ConfigGroups;

    /**
     * Config items
     */
    items: TItems;

    /**
     * Callback for computing a summary text
     */
    summary?: (context: ProviderContext) => string;
};

export type ConceptTemplate = {
    displayName: string;
    model: object;
};

/**
 * Grouping information
 */
export type ConfigGroups = {
    [key: string]: {
        /**
         * Grouping aspect
         */
        aspect?: 'content' | 'design' | 'setting';

        /**
         * Group name
         */
        name: string;
    };
};

/**
 * Defines a concept.
 */
export function defineConcept<TItems extends Concept['items']>(
    def: Concept<TItems>
) {
    return def;
}

/**
 * Gets a Zod schema for validating the model of a concept.
 * @param concept
 * @returns
 */
export function getConceptSchema<TConcept extends Concept>(
    concept: TConcept
): z.ZodObject<z.ZodRawShape> {
    return z.object({
        ...mapConfigItems(concept.items),
        $type: z.literal(NonPrimitiveTypes.concept),
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
