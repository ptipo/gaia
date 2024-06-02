import { customElement, property } from 'lit/decorators.js';
import { PtBase } from './pt-base';
import { app } from '../app';
import { getContentTypeComponent } from './contentTypes';
import { unsafeStatic, html } from 'lit/static-html.js';

@customElement('pt-form-complete-page')
class PtFormCompletePage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof app.model.completePages)[number] = {} as any;

    render() {
        const pageItems = this.page!.pageItems ?? [];

        return html` <h1 class='flex justify-center items-center'>${this.page.name}</h1> 
        ${pageItems.map((item) => {
            const tagName = getContentTypeComponent(item.$concept);

            return html`<${unsafeStatic(tagName)} data=${JSON.stringify(item)} ></${unsafeStatic(tagName)}>`;
        })}
        `;
    }
}
