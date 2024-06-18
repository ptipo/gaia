import { P, match } from 'ts-pattern';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { makeConceptSchema, type Concept } from './concept';
import { ConfigItem } from './config-item';
import type { BaseConceptModel, DeepPartialConcept, inferConcept, inferPartialConcept } from './inference';
import { GroupItem } from './items';
import { ConceptRef, isConceptInstance, isConceptRef } from './model';
import { NonPrimitiveTypes } from './types';

/**
 * Config validation issue.
 */
export type ValidationIssue = {
    /**
     * Path to the issue.
     */
    path: (string | number)[];

    /**
     * Issue message.
     */
    message: string;
};

/**
 * Instance of an app.
 */
export class AppInstance<TConcept extends Concept> {
    private conceptInstances: Record<string, BaseConceptModel> = {};
    private _model: inferPartialConcept<TConcept>;

    constructor(public readonly def: AppDef<TConcept>) {
        this._model = this.createConceptInstance(def.concept);
    }

    /**
     * The root `Concept` of the app.
     */
    get concept(): TConcept {
        return this.def.concept;
    }

    /**
     * App instance's current model.
     */
    get model() {
        return this._model;
    }

    set model(_model: inferPartialConcept<TConcept>) {
        this._model = _model;
        this.conceptInstances = {};
        this.reindexConceptInstances(this._model);
    }

    /**
     * Creates a new instance of a `Concept`.
     */
    createConceptInstance<TConcept extends Concept>(
        concept: TConcept,
        data?: Omit<DeepPartialConcept<TConcept>, '$type' | '$concept'> & Record<string, unknown>
    ): inferPartialConcept<TConcept> {
        const result: any = {
            $id: uuid(),
            $type: NonPrimitiveTypes.concept,
            $concept: concept.name,
        };

        for (const [key, value] of Object.entries(concept.items)) {
            if (data?.[key] !== undefined) {
                result[key] = data[key];
            } else {
                const subModel = this.createItemModel(value);
                if (subModel !== undefined) {
                    result[key] = subModel;
                }
            }
        }

        this.conceptInstances[result.$id] = result;

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
            .with({ type: 'image', required: true }, () => ({}))
            .with({ type: 'has' }, (item) => this.createConceptInstance(item.concept))
            .with({ type: 'has-many' }, () => [
                /* TODO: 初始项 */
            ])
            .with({ type: 'group' }, (item) => this.createGroupModel(item))
            .otherwise(() => undefined);
    }

    private createGroupModel(item: GroupItem): any {
        const result: any = {};
        for (const [key, child] of Object.entries(item.items)) {
            const itemValue = this.createItemModel(child);
            if (itemValue !== undefined) {
                result[key] = itemValue;
            }
        }
        return result;
    }

    private getModelSchema() {
        return makeConceptSchema(this.concept, {
            app: this,
            rootModel: this.model,
            currentModel: this.model,
            parentModel: undefined,
        });
    }

    /**
     * Serializes the model to a string.
     */
    stringifyModel(model: BaseConceptModel) {
        return JSON.stringify({
            model,
        });
    }

    /**
     * Loads a model from a string.
     */
    loadModel(modelData: string) {
        const deserialized = JSON.parse(modelData);
        const schema = z.object({
            model: z.any(),
        });
        const { model } = schema.parse(deserialized);
        this._model = model;
        this.reindexConceptInstances(this._model);
        return model;
    }

    /**
     * Resolves a `ConceptRef` to a `ConceptInstance`.
     */
    resolveConcept<TConcept extends Concept>(ref: ConceptRef): inferConcept<TConcept> | undefined {
        return this.conceptInstances[ref.$id] as inferConcept<TConcept>;
    }

    private reindexConceptInstances(data: unknown) {
        if (isConceptRef(data)) {
            return;
        }

        if (isConceptInstance(data)) {
            this.conceptInstances[data.$id] = data;
        }

        if (Array.isArray(data)) {
            for (const item of data) {
                this.reindexConceptInstances(item);
            }
        } else if (typeof data === 'object' && !!data) {
            for (const [key, item] of Object.entries(data)) {
                if (key.startsWith('$')) {
                    continue;
                }
                this.reindexConceptInstances(item);
            }
        }
    }

    /**
     * Validates app's model.
     */
    validateModel(
        model: unknown
    ):
        | { success: true; data: inferConcept<TConcept>; issues?: never }
        | { success: false; issues: ValidationIssue[]; data?: never } {
        const schema = this.getModelSchema();
        const { error, data } = schema.safeParse(model);
        if (error) {
            const issues = error.issues.map((issue) => {
                // TODO: move code to message translation out of the "configurator" package
                const message = match(issue)
                    .with({ code: 'invalid_type', received: 'undefined' }, () => '未设置')
                    .with({ code: 'invalid_type', received: 'array' }, () => '至少需要一项')
                    .with({ code: 'too_small', type: P.union('array', 'string') }, () => '未设置')
                    .otherwise(() => issue.code + ':' + issue.message);
                return { message, path: issue.path };
            });
            return { success: false, issues };
        } else {
            return { success: true, data: data as inferConcept<TConcept> };
        }
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
export function createAppInstance<TConcept extends Concept>(def: AppDef<TConcept>) {
    return new AppInstance(def);
}
