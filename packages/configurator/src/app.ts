import traverse from 'traverse';
import { P, match } from 'ts-pattern';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { makeConceptSchema, type Concept } from './concept';
import { ConfigItem } from './config-item';
import type { BaseConceptModel, DeepPartialConcept, inferConcept, inferPartialConcept } from './inference';
import { GetSchemaContext, GroupItem } from './items';
import { JSONSchemaBuilder } from './json-schema';
import { ConceptRef, isConceptInstance } from './model';
import { NonPrimitiveTypes } from './types';
import { ValidationIssueCode } from './validation';

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
     * Serializes the model to a string.
     */
    stringifyModel(model: BaseConceptModel) {
        return JSON.stringify({
            model,
            appVersion: this.version,
        });
    }

    /**
     * Loads a model from a string.
     */
    loadModel(modelData: string) {
        const deserialized = JSON.parse(modelData);

        const schema = z.object({
            model: z.unknown(),
            appVersion: z.string().optional(),
        });
        const { error, data } = schema.safeParse(deserialized);
        if (error) {
            // return a default model with error
            return {
                model: this.createConceptInstance(this.concept),
                appVersion: undefined,
                error: fromZodError(error),
            };
        }

        const modelSchema = this.getModelSchema({
            app: this,
            rootModel: data.model as BaseConceptModel,
            currentModel: data.model as BaseConceptModel,
            parentModel: undefined,
        });
        const parsedModel = modelSchema.safeParse(data.model);
        if (parsedModel.error) {
            // return a default model with error
            return {
                model: this.createConceptInstance(this.concept),
                appVersion: undefined,
                error: fromZodError(parsedModel.error),
            };
        }

        return { model: parsedModel.data, appVersion: data.appVersion };
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
    validateModel(
        model: unknown
    ):
        | { success: true; data: inferConcept<TConcept>; issues?: never }
        | { success: false; issues: ValidationIssue[]; data?: never } {
        const schema = this.getModelSchema({
            app: this,
            rootModel: model as BaseConceptModel,
            currentModel: model,
            parentModel: undefined,
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
            return { success: true, data: data as inferConcept<TConcept> };
        }
    }

    /**
     * Gets JSON schema for the app.
     */
    get jsonSchema() {
        return new JSONSchemaBuilder().build(this.concept);
    }
}

/**
 * Definition of an app.
 */
export interface AppDef<TConcept extends Concept> {
    concept: TConcept;
}

/**
 * Defines an app definition.
 */
export function defineApp<TConcept extends Concept>(concept: TConcept): AppDef<TConcept> {
    return { concept };
}

/**
 * Creates an app instance.
 */
export function createAppInstance<TConcept extends Concept>(def: AppDef<TConcept>, version: string) {
    return new AppInstance(def, version);
}
