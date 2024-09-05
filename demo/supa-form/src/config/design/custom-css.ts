import { defineConcept, t } from '@hayadev/configurator';
import { CodeLanguage } from '@hayadev/configurator/items';

export const CustomCSS = defineConcept({
    name: 'customCSS',
    displayName: t`customCSS`,
    items: {
        customCSS: {
            type: 'code',
            name: t`customCSS`,
            language: CodeLanguage.CSS,
        },
    },
});
