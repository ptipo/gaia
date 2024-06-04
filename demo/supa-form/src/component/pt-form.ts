import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { app } from '../app';
import './pt-form-page';
import './pt-form-complete-page';
import { PtBaseShadow } from './pt-base';
import { provide } from '@lit/context';
import { formState, stateData } from '../state';
import { keyed } from 'lit/directives/keyed.js';

@customElement('pt-form')
export class PtForm extends PtBaseShadow {
    @property()
    name?: string;

    @property({
        type: Object,
        converter: {
            fromAttribute: (value: string | null) => {
                if (value === null) return undefined;
                app.loadModel(value);
                return app.model;
            },
        },
    })
    config?: typeof app.model;

    @state()
    private pageIndex = 0;

    @provide({ context: formState })
    @state()
    formState: stateData = {};

    render() {
        console.log(this.config);
        const contentPages = this.config?.contentPages;

        if (!contentPages) {
            return html``;
        }

        const completePages = this.config?.completePages ?? [];

        const customCss = html`<style>
            h1 {
                text-align: center;
            }
        </style>`;

        const isCompletePage = this.pageIndex >= contentPages.length;

        const isLastContentPage = this.pageIndex === contentPages.length - 1;

        if (isCompletePage && completePages.length === 0) {
            return html`<h1 class='flex justify-center items-center'>Thank you</h1> `;
        }

        return html`${customCss} <h1 class="mb-1 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">This is a Form</h1>
        <div>
           ${
               isCompletePage
                   ? html`<pt-form-complete-page  .page=${
                         completePages[this.pageIndex - contentPages.length]
                     } ></pt-form-complete-page>`
                   : keyed(
                         contentPages[this.pageIndex].$id,
                         html`<pt-form-page .page=${contentPages[this.pageIndex]} ></pt-form-page>`
                     )
           } 
        </div>

        ${
            !isCompletePage
                ? html`
                <div class='flex justify-center items-center '>
                <button class='py-2 px-4' type='button' @click=${() => {
                    if (this.pageIndex > 0) this.pageIndex--;
                }} >
                    Pre
                </button>
                ${
                    isLastContentPage
                        ? html`
                <button
                    type="button" class='py-2 px-4'
                    @click=${this.onSubmit}
                >
                    Submit
                </button>
                        `
                        : html`
                    <button
                    type="button" class='py-2 px-4'
                    @click=${() => {
                        this.pageIndex++;
                    }}
                >
                    Next
                </button>
                 `
                }
                </div>
           `
                : ''
        }
        `;
    }

    private onSubmit(e: Event) {
        this.pageIndex++;
        console.log(`submit form data ${JSON.stringify(this.formState)}`);

        const options = {
            detail: this.formState,
            bubbles: true,
            composed: true,
        };

        this.dispatchEvent(new CustomEvent('pt-form-submit', options));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form': PtForm;
    }
}
