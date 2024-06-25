/**
 * Make all properties in T optional recursively
 */
export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type IncrementNameOptions = {
    suffix: string;
};

/**
 * Given a name, generates a new name ensuring that it doesn't conflict with the
 * existing names.
 */
export function incrementName(
    name: string,
    existingNames: string[],
    options: IncrementNameOptions = { suffix: 'Copy' }
) {
    if (!name) {
        return name;
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

    if (name.endsWith(options.suffix)) {
        return name + '1';
    }

    return `${name}-${options.suffix}`;
}
