import { z } from 'zod';
import { NonPrimitiveTypes } from '..';
import { wrap } from '../schema';
import { ConfigItemBase } from './common';

/**
 * Code configuration item
 */
export interface CodeItem extends ConfigItemBase {
    type: 'code';

    /**
     * Language of the code
     */
    language: CodeLanguage;
}

/**
 * Code language
 */
export enum CodeLanguage {
    CSS = 'css',
}

export const getSchema = (item: ConfigItemBase) =>
    wrap(
        item,
        z.object({
            $type: z.literal(NonPrimitiveTypes.code),
            source: item.required ? z.string().min(1) : z.string(),
            language: z.nativeEnum(CodeLanguage),
        })
    );

export type Code = z.infer<ReturnType<typeof getSchema>>;
