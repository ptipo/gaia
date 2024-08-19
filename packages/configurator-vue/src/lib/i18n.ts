import { getTranslationKey, TranslationFunction } from '@hayadev/configurator';
import { createI18n } from 'vue-i18n';

/**
 * Gets an app config translator.
 * @param i18n
 * @returns
 */
export function getTranslator(i18n: ReturnType<typeof createI18n>) {
    return (key: string, args?: Record<string, any>) => {
        const tlKey = getTranslationKey(key);
        if (tlKey !== key) {
            return (i18n.global.t as TranslationFunction)(tlKey, args);
        } else {
            return key;
        }
    };
}

/**
 * Identity translator.
 */
export function ident(key: string, _args?: Record<string, any>) {
    return key;
}
