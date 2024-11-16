import { z, type ZodSchema } from 'zod';
import type { AppInstance, ConfigAspects, InitializeContext, TranslationFunction, ValidationIssue } from '.';
import { ConfigItem, makeConfigItemSchema } from './config-item';
import type { BaseConceptModel, inferConcept } from './inference';
import type { GetSchemaContext } from './items';
import { NonPrimitiveTypes, type ProviderContext } from './types';
import { WebsiteStyle } from './app-instance';

/**
 * Metadata for importing a concept model.
 */
export type ImportMetadata = {
    /**
     * The app instance
     */
    app: AppInstance<Concept>;

    /**
     * The app version of the model being imported
     */
    version: string;
};

/**
 * Result of importing a concept model.
 */
export type ImportResult<TConcept extends Concept> =
    | {
          success: true;
          model: inferConcept<TConcept>;
      }
    | { success: false; errors: string[] };

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
     * Description
     */
    description?: string;

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
     * If the concept can be selected as a preview target in the configuration UI
     */
    selectable?: boolean;

    /**
     * Callback for initializing a new model
     */
    initialize?: (context: InitializeContext) => Partial<BaseConceptModel>;

    /**
     * Callback for handling model changes
     */
    onModelChange?: (model: BaseConceptModel, key: string, value: unknown) => void;

    /**
     * Callback for doing custom validation
     */
    validate?: (model: BaseConceptModel, ct: TranslationFunction) => ValidationIssue[] | undefined;

    /**
     * Function for importing a model potentially generated by another version of the app or an external source
     */
    import?: (data: object, metadata: ImportMetadata) => ImportResult<Concept>;

    /**
     * Function for merging style data with a model
     */
    mergeStyle?: (data: WebsiteStyle, model: BaseConceptModel) => ImportResult<Concept>;

    /**
     * Items to be excluded from the generated JSON schema
     * @private
     */
    excludeFromSchema?: string[];
};

/**
 * Grouping information
 */
export type ConfigGroups = {
    [key: string]: {
        /**
         * Grouping aspect
         */
        aspect?: ConfigAspects;

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
    let result: ZodSchema = z.object({
        $id: z.string(),
        $type: z.literal(NonPrimitiveTypes.concept),
        $concept: z.literal(concept.name),
        ...mapConfigItems(concept.items, context),
    });

    if (concept.validate) {
        result = result.superRefine((model, ctx) => {
            const issues = concept.validate!(model, (key) => key);
            issues?.forEach((issue) => {
                ctx.addIssue({
                    code: 'custom',
                    params: { customCode: issue.code, customMessage: issue.message },
                    path: issue.path,
                    message: issue.message,
                });
            });
        });
    }

    return result;
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
