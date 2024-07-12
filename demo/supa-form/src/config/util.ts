import { createRef } from '@hayadev/configurator';

/**
 * 从root model获取所有页面
 */
export function getAllPages(rootModel: any) {
    return [
        ...rootModel.contentPages.map((page: any) => ({
            key: page.$id,
            label: page.name,
            value: createRef(page),
        })),
        ...getCompletePages(rootModel),
    ];
}

export function getCompletePages(rootModel: any) {
    return rootModel.completePages.map((page: any) => ({
        key: page.$id,
        label: page.name,
        value: createRef(page),
    }));
}
