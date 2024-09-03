import { defineConcept, t } from '@hayadev/configurator';
import { getAllPages } from '../../util';
import { CodeLanguage } from '@hayadev/configurator/items';

export const Button = defineConcept({
    name: 'Button',
    displayName: t`button`,

    items: {
        text: {
            type: 'text',
            name: t`text`,
            required: true,
        },

        action: {
            type: 'select',
            name: t`action`,
            required: true,
            options: {
                openLink: t`openLink`,
                gotoPage: t`gotoPage`,
                executeJSCode: t`executeJSCode`,
            },
        },

        url: {
            type: 'if',
            name: t`url`,
            condition: { field: 'action', value: 'openLink' },
            child: {
                type: 'text',
                name: 'URL',
                kind: 'url',
                required: true,
            },
        },

        targetPage: {
            type: 'if',
            name: t`targetPage`,
            condition: { field: 'action', value: 'gotoPage' },
            child: {
                type: 'dynamic-select',
                name: t`gotoPage`,
                required: true,
                provider: ({ rootModel }) => getAllPages(rootModel),
            },
        },

        code: {
            type: 'if',
            name: t`code`,
            condition: { field: 'action', value: 'executeJSCode' },
            child: {
                type: 'code',
                name: t`code`,
                required: true,
                language: CodeLanguage.JavaScript,
            },
        },
    },
});
