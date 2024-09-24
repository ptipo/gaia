import { type Concept } from './concept';
import { ModelGenerationArgs, ModelGenerationHintProviderArgs, ModelGenerationResult, ConfigAspects } from './types';

/**
 * Definition of an app.
 */
export interface AppDef<TConcept extends Concept> {
    /**
     * The root concept of the app.
     */
    concept: TConcept;

    /**
     * Callback for providing hint message for generating a model.
     */
    generateModelHint?: (args: ModelGenerationHintProviderArgs) => string;

    /**
     * Callback for generating a model (potentially from an external API).
     */
    generateModel?: (args: ModelGenerationArgs) => Promise<ModelGenerationResult>;

    /**
     * Supported aspects for generating models.
     */
    supportedGenerateAspects?: () => ConfigAspects[];
}

/**
 * Defines an app definition.
 */
export function defineApp<TConcept extends Concept>(def: AppDef<TConcept>): AppDef<TConcept> {
    return def;
}
