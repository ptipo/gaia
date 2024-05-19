import { Concept, inferConceptModel } from '.';
import { NonPrimitiveTypes } from './types';

export type DeepPartialConceptModel<TModel> = {
    $type: NonPrimitiveTypes.concept;
    $concept: string;
} & {
    [Key in keyof Omit<
        TModel,
        '$type' | '$concept'
    >]?: TModel[Key] extends inferConceptModel<Concept>
        ? DeepPartialConceptModel<TModel[Key]>
        : TModel[Key];
};
