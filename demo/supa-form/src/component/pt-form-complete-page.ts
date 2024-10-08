import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { getContentTypeComponent } from './contentTypes';
import { PtBase } from './pt-base';
import { model } from './pt-form';

@customElement('pt-form-complete-page')
class PtFormCompletePage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof model.completePages)[number] = {} as any;

    render() {
        const pageItems = this.page!.pageItems ?? [];

        return html`
            ${pageItems.map((item) => {
                const tagName = getContentTypeComponent(item.$concept);

                return html`<div class="flex flex-col mt-10 px-10 gap-y-10"><${unsafeStatic(
                    tagName
                )} data=${JSON.stringify(item)} ></${unsafeStatic(tagName)}>
                 </div>`;
            })}
        `;
    }
}
