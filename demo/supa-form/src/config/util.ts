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
        ...rootModel.completePages.map((page: any) => ({
            key: page.$id,
            label: page.name,
            value: createRef(page),
        })),
    ];
}

/**
 * 基于给定名称，生成和给定集合不重复的新名称
 */
export function incrementName(name: string, existingNames: string[]) {
    if (!name) {
        return '未命名';
    }

    const numberedSuffix = parseInt(name[name.length - 1]);
    if (!Number.isNaN(numberedSuffix)) {
        let curr = numberedSuffix;
        while (true) {
            const nextName = name.slice(0, name.length - 1) + (curr + 1);
            if (!existingNames.includes(nextName)) {
                return nextName;
            }
            curr++;
        }
    }

    if (name.endsWith('副本')) {
        return name + '1';
    }

    return name + ' - 副本';
}
