import { defineConcept, t } from '@hayadev/configurator';
import { getAllPages } from '../util';

/**
 * 跳转至页面
 */
export const GoToPageAction = defineConcept({
    name: 'GoToPageAction',

    displayName: t`gotoPage`,

    items: {
        /**
         * 跳转页面
         */
        goToPage: {
            type: 'dynamic-select',
            name: t`targetPage`,
            inline: true,

            // 从root model获取所有页面
            provider: ({ rootModel }) => getAllPages(rootModel),
        },
    },

    summary: ({ app, rootModel, currentModel, ct }) => {
        let pageName = ct(t`notSet`);
        if (currentModel) {
            const page = currentModel?.goToPage && app.resolveConcept(rootModel, currentModel.goToPage);
            if (page) {
                pageName = page.name;
            }
        }

        return ct(t`gotoPage`) + ` - ${pageName}`;
    },
});
