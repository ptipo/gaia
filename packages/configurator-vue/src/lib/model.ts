/**
 * Increments the given name with a numbered suffix.
 */
export function incrementName(name: string) {
    if (!name) {
        return '未命名';
    }

    const numberedSuffix = parseInt(name[name.length - 1]);
    if (!Number.isNaN(numberedSuffix)) {
        return name.slice(0, name.length - 1) + (numberedSuffix + 1);
    }

    if (name.endsWith('副本')) {
        return name + '1';
    }

    return name + ' - 副本';
}
