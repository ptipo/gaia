import { ZodSchema } from 'zod';
import { ConfigItemBase } from './items';

export function wrap(item: ConfigItemBase, schema: ZodSchema) {
    return item.required ? schema : schema.optional();
}
