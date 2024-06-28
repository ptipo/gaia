import { customElement, property, state } from 'lit/decorators.js';
import { PtBase, PtBaseData, PtFormSingleChoiceSelectedEventName, PtFormNextPageEventName } from './pt-base';
import { app } from '../app';
import { getContentTypeComponent } from './contentTypes';
import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { PtChoice } from './contentTypes/pt-choice';
import { provide } from '@lit/context';
import { formWidth } from '../state';
import { ResizeController } from '@lit-labs/observers/resize-controller.js';
import { msg } from '@lit/localize';

@customElement('pt-form-page')
export class PtFormPage extends PtBase {
    @property()
    name?: string;

    @property({ type: Object })
    page: (typeof app.model.contentPages)[number] = {} as any;

    @provide({ context: formWidth })
    @state()
    private widthLevel = 1;

    screenWidthLevel = [375, 768, 820, 1024, Infinity];

    private _observer = new ResizeController(this, {
        callback: () => {
            const { width } = this.getBoundingClientRect();
            const level = this.screenWidthLevel.findIndex((x) => x > width + 4) + 1;
            if (level != this.widthLevel) {
                this.widthLevel = level;
            }
        },
    });

    @state()
    showValidationError = false;

    isValid = true;

    pageItems?: Map<string, LitElement>;

    connectedCallback() {
        super.connectedCallback();

        this.pageItems = new Map(
            this.page.pageItems.map((item) => {
                const el = this.getLitElementFromPageItem(item);
                return [item.$id, el];
            })
        );

        const allQuestions = Array.from(this.pageItems.values()).filter((x) => x instanceof PtBaseData);

        if (allQuestions.length == 1 && allQuestions[0] instanceof PtChoice) {
            allQuestions[0].addEventListener(PtFormSingleChoiceSelectedEventName, () => {
                this.dispatchEvent(new CustomEvent(PtFormNextPageEventName));
            });
        }
    }

    render() {
        this.isValid = true;
        return html`<div class="flex flex-col mt-10 px-10 gap-y-10 animate-[ffadeInUp_.5s]">
            ${this.page.pageItems?.map((item) => {
                let el = this.pageItems?.get(item.$id)!;

                if (!el) {
                    // this happens in the edit-mode
                    el = this.getLitElementFromPageItem(item);
                    this.pageItems?.set(item.$id, el);
                }

                el.setAttribute('data', JSON.stringify(item));

                let errorMessage;
                if (this.showValidationError && el instanceof PtBaseData) {
                    errorMessage = el.getValidateError();

                    if (this.isValid) {
                        this.isValid = !errorMessage;
                    }
                }

                return html`<div>
                    ${el}
                    ${when(
                        errorMessage,
                        () => html`<p class="text-red-500  font-normal mt-2">${msg(errorMessage!)}</p>`
                    )}
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

    private getLitElementFromPageItem(item: (typeof this.page.pageItems)[number]) {
        const tagName = getContentTypeComponent(item.$concept);
        const el = document.createElement(tagName) as LitElement;
        el.style.display = 'block';
        return el;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form-page': PtFormPage;
    }
}
