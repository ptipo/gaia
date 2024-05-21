import deepcopy from 'deepcopy';
import { z } from 'zod';
import { getConceptSchema, type Concept } from './concept';
import type { inferPartialConcept } from './inference';
import { createModelForConcept } from './model';
import { deserializeAppModel, serializeAppModel } from './serialization';

/**
 * 应用配置 - 创建自一个顶级`Concept`
 */
export interface App<
    TConcept extends Concept,
    TModel = inferPartialConcept<TConcept>
> {
    /**
     * 创建一个空白Model
     */
    createModel(): TModel;

    /**
     * 序列化一个Model
     */
    stringifyModel(model: TModel): string;

    /**
     * 反序列化一个Model
     */
    parseModel(serialized: string): TModel;

    /**
     * 当前应用的`Concept`
     */
    get concept(): TConcept;
}

class AppImpl<TConcept extends Concept> implements App<TConcept> {
    private readonly schema: z.ZodObject<z.ZodRawShape>;

    constructor(public readonly concept: TConcept) {
        this.schema = this.createModelSchema();
    }

    createModel() {
        return createModelForConcept<TConcept>(this.concept);
    }

    private createModelSchema() {
        return getConceptSchema(this.concept);
    }

    stringifyModel(model: inferPartialConcept<TConcept>) {
        const clone = deepcopy(model);
        return serializeAppModel(clone);
    }

    parseModel(modelData: string): inferPartialConcept<TConcept> {
        return deserializeAppModel(modelData) as inferPartialConcept<TConcept>;
    }
}

/**
 * 创建一个App
 */
export function defineApp<TConcept extends Concept>(
    concept: TConcept
): App<TConcept> {
    return new AppImpl(concept);
}
