import { getTranslationKey, TranslationFunction } from '@hayadev/configurator';
import { createI18n, useI18n } from 'vue-i18n';

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

/**
 * Creates a translator for the app config
 */
export function useConfigI18n(localeMessages: Record<string, Record<string, any>>) {
    const { locale } = useI18n();
    const configI18n = createI18n({ legacy: false, messages: localeMessages, locale: locale.value });
    const configTranslate = getTranslator(configI18n as any);
    return { configI18n, ct: configTranslate };
}
