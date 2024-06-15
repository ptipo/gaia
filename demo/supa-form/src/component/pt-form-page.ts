import { customElement, property, state } from 'lit/decorators.js';
import { PtBase, PtBaseData } from './pt-base';
import { app } from '../app';
import { getContentTypeComponent } from './contentTypes';
import { css, html } from 'lit';
import { when } from 'lit/directives/when.js';

@customElement('pt-form-page')
export class PtFormPage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof app.model.contentPages)[number] = {} as any;

    @state()
    showValidationError = false;

    isValid = true;

    pageItems?: HTMLElement[];

    connectedCallback() {
        super.connectedCallback();

        this.pageItems = this.page.pageItems.map((item) => {
            const tagName = getContentTypeComponent(item.$concept);

            const el = document.createElement(tagName);

            el.setAttribute('data', JSON.stringify(item));
            el.style.display = 'block';

            return el;
        });
    }

    render() {
        return html`<div class="flex flex-col mt-10 px-10 gap-y-10">
            ${this.pageItems?.map((item) => {
                let errorMessage;
                if (this.showValidationError && item instanceof PtBaseData) {
                    errorMessage = item.getValidateError();
                    this.isValid = !errorMessage;
                }

                return html`<div>
                    ${item}
                    ${when(errorMessage, () => html`<p class="text-red-500  font-normal mt-2">${errorMessage!}</p>`)}
                </div>`;
            })}
        </div> `;
    }

    async validatePage() {
        this.showValidationError = true;
        this.requestUpdate();
        await this.updateComplete;

        console.log('this.isValid', this.isValid);
        return this.isValid;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form-page': PtFormPage;
    }
}
