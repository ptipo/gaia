import { createRef } from '@gaia/configurator';

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
        ...rootModel.completePages.map((page: any) => ({
            key: page.$id,
            label: page.name,
            value: createRef(page),
        })),
    ];
}
