import { customElement, property } from 'lit/decorators.js';
import { PtBase } from './pt-base';
import { app } from '../app';
import { getContentTypeComponent } from './contentTypes';
import { unsafeStatic, html } from 'lit/static-html.js';
import { css } from 'lit';

@customElement('pt-form-page')
export class PtFormPage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof app.model.contentPages)[number] = {} as any;

    static styles = css`
        :host {
            display: block;
        }
    `;

    render() {
        const pageItems = this.page!.pageItems ?? [];

        return html`<div class="flex flex-col mt-10 px-10 gap-y-10">
            ${pageItems.map((item) => {
                const tagName = getContentTypeComponent(item.$concept);

                return html`<${unsafeStatic(tagName)} class="block" data=${JSON.stringify(item)} ></${unsafeStatic(
                    tagName
                )}></div>`;
            })}
        </div> `;
    }
}
