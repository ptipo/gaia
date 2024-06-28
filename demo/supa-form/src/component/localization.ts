import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from '../generated/locale-codes.js';

import * as templates_zh_cn from '../generated/locales/zh-CN.js';
import * as templates_ja_jp from '../generated/locales/ja-JP.js';

const localizedTemplates = new Map([
    ['zh-CN', templates_zh_cn],
    ['ja-JP', templates_ja_jp],
]);

export const { getLocale, setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    // @ts-ignore
    loadLocale: async (locale) => localizedTemplates.get(locale),
});
