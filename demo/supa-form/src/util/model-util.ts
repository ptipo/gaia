import { FormModel } from '../app';

export function findPageItemConfigById(model: FormModel, id: string) {
    return model.contentPages.flatMap((page) => page.pageItems).find((item) => item.$id == id);
}

export function isNullOrEmpty(value: any) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }

    // Add additional checks here if needed for other types
    return false;
}
