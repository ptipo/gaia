import { languages, defaultLocale } from './i18n';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages: languages,
}));
