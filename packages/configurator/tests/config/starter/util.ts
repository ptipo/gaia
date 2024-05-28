/**
 * 从root model获取所有页面
 */
export function getAllPages(rootModel: any) {
    return [
        ...rootModel.contentPages.map((page: any, index: number) => ({
            key: `content-page-${index}`,
            label: page.name,
            value: page,
        })),
        ...rootModel.completePages.map((page: any, index: number) => ({
            key: `complete-page-${index}`,
            label: page.name,
            value: page,
        })),
    ];
}
