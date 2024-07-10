import { ZodSchema } from 'zod';
import { ConfigItemBase } from './items';

export function wrap<T extends ZodSchema>(item: ConfigItemBase, schema: T) {
    return item.required ? schema : schema.optional();
}
