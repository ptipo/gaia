import { type BaseConceptModel, type Concept } from '@hayadev/configurator';

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
