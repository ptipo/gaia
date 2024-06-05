import { ConceptRef, defineConcept } from '@gaia/configurator';
import { getAllPages } from '../util';

/**
 * 跳转至页面
 */
export const GoToPageAction = defineConcept({
    name: 'GoToPageAction',

    displayName: '跳转页面',

    items: {
        /**
         * 跳转页面
         */
        goToPage: {
            type: 'dynamic-select',
            name: '目标页面',

            // 从root model获取所有页面
            provider: ({ rootModel }) => getAllPages(rootModel),
        },
    },

    summary: ({ app, currentModel }) => {
        let pageName = '未设置';
        if (currentModel) {
            const pageRef: ConceptRef = currentModel.goToPage;
            const page = app.resolveConcept(pageRef);
            if (page) {
                pageName = page.name;
            }
        }

        return `跳转到页面 - ${pageName}`;
    },
});
