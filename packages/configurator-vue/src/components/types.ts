import { type BaseConceptModel, type Concept, type ConfigAspects } from '@hayadev/configurator';

/**
 * Type for notifying entering of a concept editing.
 */
export type EnterConceptData = {
    concept: Concept;
    model: BaseConceptModel;
    path: Array<string | number>;
};

/**
 * A segment of model edit path.
 */
export type EditPathRecord = string | number;

/**
 * Concept and its model.
 */
export type ConceptModelPair = {
    concept: Concept;
    model: BaseConceptModel;
};

/**
 * Image uploader function.
 */
export type ImageUploader = (file: File) => Promise<string | undefined>;

/**
 * Model generation arguments.
 */
export type ModelGenerationArgs = {
    /**
     * Aspect to generate model for.
     */
    aspect: ConfigAspects;

    /**
     * Hint message to display for initial user input.
     */
    userInputHint: string;

    /**
     * Hint message to display with elaboration result.
     */
    modelGenerationHint: string;
};
