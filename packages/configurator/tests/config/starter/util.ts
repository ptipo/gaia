/**
 * 从root model获取所有页面
 */
export function getAllPages(rootModel: any) {
    return [
        ...rootModel.contentPages.map((page: any) => ({
            label: page.name,
            value: page,
        })),
        ...rootModel.completePages.map((page: any) => ({
            label: page.name,
            value: page,
        })),
    ];
}
