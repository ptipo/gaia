/**
 * RGBA格式的颜色
 */
export type RGBA = `rgba(${number},${number},${number},${number})`;

export function isRGBA(input: unknown): input is string {
    if (typeof input !== 'string') {
        return false;
    } else {
        return /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*\d(\.\d+)?\)$/.test(
            input
        );
    }
}

export enum NonPrimitiveTypes {
    concept = 'concept',
    image = 'image',
    logicalGroup = 'logical-group',
    itemGroup = 'item-group',
}
