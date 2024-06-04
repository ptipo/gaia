import { customElement, property } from 'lit/decorators.js';
import { PtBase } from './pt-base';
import { app } from '../app';
import { getContentTypeComponent } from './contentTypes';
import { unsafeStatic, html } from 'lit/static-html.js';

@customElement('pt-form-page')
class PtFormPage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof app.model.contentPages)[number] = {} as any;

    render() {
        const pageItems = this.page!.pageItems ?? [];

        return html`<h2 class="text-m font-extrabold dark:text-white">${this.page.name}</h2>

        ${pageItems.map((item) => {
            const tagName = getContentTypeComponent(item.$concept);

            return html`<div class="mb-5"></div><${unsafeStatic(tagName)} data=${JSON.stringify(
                item
            )} ></${unsafeStatic(tagName)}></div>`;
        })}
        `;
    }
}
