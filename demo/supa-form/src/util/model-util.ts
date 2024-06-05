import { app } from '../app';

export function findPageItemConfigById(model: typeof app.model, id: string) {
    return model.contentPages.flatMap((page) => page.pageItems).find((item) => item.$id == id);
}
