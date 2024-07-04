import { z } from 'zod';
import { ConfigItem, makeConfigItemSchema } from './config-item';
import type { GetSchemaContext } from './items';
import { NonPrimitiveTypes, ProviderContext } from './types';
import type { BaseConceptModel } from './inference';

/**
 * A configurable abstract concept containing a set of config items.
 */
export type Concept<TItems extends Record<string, ConfigItem> = Record<string, ConfigItem>> = {
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

    /**
     * If the concept can be selected as a preview target
     */
    selectable?: boolean;

    /**
     * Callback for handling model changes
     */
    onModelChange?: (model: BaseConceptModel, key: string, value: unknown) => void;
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
export function defineConcept<TItems extends Concept['items']>(def: Concept<TItems>) {
    return def;
}

/**
 * Gets a Zod schema for validating the model of a concept.
 * @param concept
 * @returns
 */
export function makeConceptSchema<TConcept extends Concept>(concept: TConcept, context: GetSchemaContext) {
    return z.object({
        $id: z.string(),
        $type: z.literal(NonPrimitiveTypes.concept),
        $concept: z.literal(concept.name),
        ...mapConfigItems(concept.items, context),
    });
}

function mapConfigItems(items: Record<string, ConfigItem>, context: GetSchemaContext) {
    return Object.entries(items).reduce(
        (acc, [key, item]) => ({
            ...acc,
            [key]: makeConfigItemSchema(item, {
                ...context,
                currentModel: context.currentModel?.[key],
                parentModel: context.currentModel,
            }),
        }),
        {}
    );
}

export function isConcept(value: unknown): value is Concept {
    return typeof value === 'object' && !!value && 'items' in value && typeof value === 'object';
}
