/**
 * Tagging text for translation
 */
export function t(strings: TemplateStringsArray, ...values: string[]) {
    return `$t(${String.raw({ raw: strings }, ...values)})`;
}

/**
 * Get translation key from tagged text
 */
export function getTranslationKey(text: string) {
    const match = /\$t\(([^)]+)\)/.exec(text);
    return match ? match[1] : text;
}

/**
 * Translation function type
 */
export type TranslationFunction = (key: string, args?: Record<string, unknown>) => string;
