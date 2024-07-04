import { AppInstance } from './app';
import { Concept } from './concept';
import { BaseConceptModel } from './inference';

/**
 * RGBA color.
 */
export type RGBA = `rgba(${number},${number},${number},${number})`;

/**
 * Checks if the input is a valid RGBA color.
 */
export function isRGBA(input: unknown): input is string {
    if (typeof input !== 'string') {
        return false;
    } else {
        return /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*\d(\.\d+)?\)$/.test(input);
    }
}

/**
 * Non-primitive types.
 */
export enum NonPrimitiveTypes {
    concept = 'concept',
    ref = 'ref',
    image = 'image',
    logicalGroup = 'logical-group',
    itemGroup = 'item-group',
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
};

export type ConceptValidationError = { message: string };

export type ConceptValidator = (model: BaseConceptModel) => ConceptValidationError[] | undefined;
