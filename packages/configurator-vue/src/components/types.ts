import { type BaseConceptModel, type Concept } from '@gaia/configurator';

/**
 * Type for notifying entering of a concept editing.
 */
export type EnterConceptData = {
    concept: Concept;
    model: BaseConceptModel;
    parentKey: Array<string | number>;
};

export type EditPathRecord = { parentKey: Array<number | string>; concept: Concept };
