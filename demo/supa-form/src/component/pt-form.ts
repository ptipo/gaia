import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { app } from '../app';
import './pt-form-page';
import './pt-form-complete-page';
import { PtBaseShadow } from './pt-base';
import { provide } from '@lit/context';
import { formState, stateData } from '../state';

@customElement('pt-form')
class PtForm extends PtBaseShadow {
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
        const contentPages = this.config?.contentPages ?? [];
        const completePages = this.config?.completePages ?? [];
        const customCss = html`<style>
            h1 {
                text-align: center;
            }
        </style>`;

        const isCompletePage = this.pageIndex >= contentPages.length;

        const isLastContentPage = this.pageIndex === contentPages.length - 1;

        return html`${customCss} <h1>This is a From</h1>
        
        <div>
           ${
               isCompletePage
                   ? html`<pt-form-complete-page .page=${
                         completePages[this.pageIndex - contentPages.length]
                     } ></pt-form-complete-page>`
                   : html`<pt-form-page .page=${contentPages[this.pageIndex]} ></pt-form-page>`
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
    }
}
