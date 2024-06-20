/**
 * Given a name, generates a new name ensuring that it doesn't conflict with the
 * existing names.
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
