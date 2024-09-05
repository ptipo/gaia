import deepcopy from 'deepcopy';
import traverse from 'traverse';
import { P, match } from 'ts-pattern';
import { v4 as uuid } from 'uuid';
import { makeConceptSchema, type Concept } from './concept';
import { ConfigItem } from './config-item';
import type { BaseConceptModel, DeepPartialConcept, inferConcept, inferPartialConcept } from './inference';
import { GetSchemaContext, GroupItem } from './items';
import { JSONSchemaBuilder } from './json-schema';
import { ConceptRef, isConceptInstance } from './model';
import { ConfigAspects, NonPrimitiveTypes } from './types';
import { ValidationIssueCode } from './validation';
import { TranslationFunction } from './i18n';

/**
 * Config validation issue.
 */
export type ValidationIssue = {
    /**
     * Path to the issue.
     */
    path: (string | number)[];

    /**
     * Issue code.
     */
    code: ValidationIssueCode;

    /**
     * Issue message.
     */
    message: string;

    /**
     * Custom message.
     */
    customMessage?: string;
};

/**
 * Validation result.
 */
export type ValidationResult<TConcept extends Concept> =
    | {
          success: true;
          model: inferConcept<TConcept>;
      }
    | { success: false; issues: ValidationIssue[] };

/**
 * Instance of an app.
 */
export class AppInstance<TConcept extends Concept> {
    constructor(public readonly def: AppDef<TConcept>, public readonly version: string) {}

    /**
     * The root `Concept` of the app.
     */
    get concept(): TConcept {
        return this.def.concept;
    }

    /**
     * Creates a new instance of a `Concept`.
     */
    createConceptInstance<TConcept extends Concept>(
        concept: TConcept,
        data?: Omit<DeepPartialConcept<TConcept>, '$type' | '$concept'> & Record<string, unknown>
    ): inferPartialConcept<TConcept> {
        // start with calling initializer
        const result: any = concept.initialize ? concept.initialize({ app: this }) : {};

        // force overriding builtin fields
        result.$id = uuid();
        result.$type = NonPrimitiveTypes.concept;
        result.$concept = concept.name;

        for (const [key, value] of Object.entries(concept.items)) {
            if (result[key] !== undefined) {
                // don't override existing keys
                continue;
            }
            if (data?.[key] !== undefined) {
                result[key] = data[key];
            } else {
                const subModel = this.createItemModel(value);
                if (subModel !== undefined) {
                    result[key] = subModel;
                }
            }
        }
        return result;
    }

    /**
     * Creates a default model for a `ConfigItem`.
     */
    createItemModel(item: ConfigItem): any {
        return match(item)
            .with(
                { type: P.union('text', 'number', 'switch', 'select'), default: P.not(undefined) },
                (item) => item.default
            )
            .with({ type: 'image', required: true }, (item) => ({ $type: NonPrimitiveTypes.image, url: item.default }))
            .with({ type: 'has' }, (item) => this.createConceptInstance(item.concept))
            .with({ type: 'has-many' }, () => [
                /* TODO: 初始项 */
            ])
            .with({ type: 'group' }, (item) => this.createGroupModel(item))
            .with({ type: 'code' }, (item) => ({ $type: NonPrimitiveTypes.code, source: '', language: item.language }))
            .otherwise(() => undefined);
    }

    private createGroupModel(item: GroupItem): any {
        const result: any = { $type: NonPrimitiveTypes.itemGroup };
        for (const [key, child] of Object.entries(item.items)) {
            const itemValue = this.createItemModel(child);
            if (itemValue !== undefined) {
                result[key] = itemValue;
            }
        }
        return result;
    }

    private getModelSchema(context: GetSchemaContext) {
        return makeConceptSchema(this.concept, context);
    }

    /**
     * Resolves a `ConceptRef` to a `ConceptInstance`.
     */
    resolveConcept<TResolveConcept extends Concept>(
        model: inferConcept<TConcept>,
        ref: ConceptRef
    ): inferConcept<TResolveConcept> | undefined {
        let found: inferConcept<TResolveConcept> | undefined;
        traverse(model).forEach(function (node) {
            if (isConceptInstance(node) && node.$concept === ref.$concept && node.$id === ref.$id) {
                found = node as inferConcept<TResolveConcept>;
                this.stop();
            }
        });
        return found;
    }

    /**
     * Validates app's model.
     */
    validateModel(model: unknown, autoFix = false): ValidationResult<TConcept> {
        const schema = this.getModelSchema({
            app: this,
            rootModel: model as BaseConceptModel,
            currentModel: model,
            parentModel: undefined,
            autoFix,
            ct: (key) => key, // TODO: translation
        });
        const { error, data } = schema.safeParse(model);
        if (error) {
            const issues = error.issues.map((issue) => {
                const code = match(issue)
                    .with(
                        { code: 'custom', params: { customCode: P.any } },
                        ({ params }) => params.customCode as ValidationIssueCode
                    )
                    .with({ code: 'invalid_type', received: 'undefined' }, () => ValidationIssueCode.Required)
                    .with({ code: 'invalid_type', received: 'array' }, () => ValidationIssueCode.RequiredArray)
                    .with({ code: 'too_small', type: P.union('array', 'string') }, () => ValidationIssueCode.Required)
                    .otherwise(() => ValidationIssueCode.InvalidValue);

                const customMessage = issue.code === 'custom' ? (issue.params?.customMessage as string) : undefined;
                return { code, message: issue.message, customMessage, path: issue.path };
            });
            return { success: false, issues };
        } else {
            return { success: true, model: data as inferConcept<TConcept> };
        }
    }

    /**
     * Gets JSON schema for the app.
     */
    get jsonSchema() {
        return new JSONSchemaBuilder().build(this.concept);
    }

    /**
     * Imports a model potentially generated from a different version or an external source.
     */
    importModel(data: object): ValidationResult<Concept> {
        let model = deepcopy(data);

        // call user provided import function if available
        if (this.concept.import) {
            const conceptImportResult = this.concept.import(data, { app: this, version: this.version });
            if (conceptImportResult.success === false) {
                return {
                    issues: conceptImportResult.errors.map((e) => ({
                        code: ValidationIssueCode.InvalidValue,
                        message: e,
                        path: [],
                    })),
                    success: false,
                };
            } else {
                model = conceptImportResult.model;
            }
        }

        // validate the result model
        return this.validateModel(model, true);
    }
}

/**
 * Context data for invoking provider for computing hint messages used in model generation.
 */
export type ModelGenerationHintProviderArgs = {
    /**
     * Input kind.
     */
    kind: 'user-input' | 'elaboration';

    /**
     * The aspect of the configuration to generate for.
     */
    aspect?: ConfigAspects;

    /**
     * Translation function.
     */
    ct: TranslationFunction;
};

/**
 * Model generation input.
 */
export type ModelGenerationArgs = {
    /**
     * The current model that the generation can start from.
     */
    currentModel?: BaseConceptModel;

    /**
     * The aspect of the configuration to generate for. Defaults to all.
     */
    aspect?: ConfigAspects;

    /**
     * The kind of input: user-provided or elaboration generated by a previous generation step.
     */
    kind: 'user-input' | 'elaboration';

    /**
     * The input data.
     */
    data: string;

    /**
     * Secret keys used for model generation.
     */
    secrets?: unknown;
};

/**
 * Result of model generation.
 */
export type ModelGenerationResult =
    | {
          kind: 'model';
          result: BaseConceptModel;
      }
    | {
          kind: 'elaboration';
          result: string;
      };

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
}

/**
 * Defines an app definition.
 */
export function defineApp<TConcept extends Concept>(def: AppDef<TConcept>): AppDef<TConcept> {
    return def;
}

/**
 * Creates an app instance.
 */
export function createAppInstance<TConcept extends Concept>(def: AppDef<TConcept>, version: string) {
    return new AppInstance(def, version);
}
