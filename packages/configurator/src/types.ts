import { AppInstance } from './app';
import { Concept } from './concept';
import { TranslationFunction } from './i18n';
import { BaseConceptModel } from './inference';
import { ValidationIssueCode } from './validation';

/**
 * Config aspects.
 */
export type ConfigAspects = 'content' | 'design' | 'setting';

/**
 * Non-primitive types.
 */
export enum NonPrimitiveTypes {
    concept = 'concept',
    ref = 'ref',
    image = 'image',
    logicalGroup = 'logical-group',
    itemGroup = 'item-group',
    code = 'code',
}

/**
 * Context data for invoking a provider callback.
 */
export type ProviderContext = {
    /**
     * The app instance
     */
    app: AppInstance<Concept>;

    /**
     * The app's root model
     */
    rootModel: BaseConceptModel;

    /**
     * The current context model
     */
    currentModel: any;

    /**
     * Function for translating texts in app config
     */
    ct: TranslationFunction;
};

/**
 * Context for calling initializer of a concept.
 */
export type InitializeContext = {
    /**
     * The app instance
     */
    app: AppInstance<Concept>;
};

/**
 * Issues reported by custom validation.
 */
export type CustomValidationIssue = { code: ValidationIssueCode; message: string; path: (string | number)[] };

/**
 * Custom validator for a concept.
 */
export type ConceptCustomValidator = (model: BaseConceptModel) => CustomValidationIssue[] | undefined;

/**
 * Data for a selected concept instance.
 */
export type SelectionData = {
    /**
     * The selected concept
     */
    concept: Concept;

    /**
     * The selected concept instance id
     */
    id: string;
};
