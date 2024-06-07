import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { app } from '../app';
import './pt-form-page';
import './pt-form-complete-page';
import { PtBaseShadow } from './pt-base';
import { provide } from '@lit/context';
import { formState, answerData } from '../state';
import { keyed } from 'lit/directives/keyed.js';
import { validateLogic } from '../util/logic-resolver';
import { ConceptRef } from '@gaia/configurator';

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
    private pageId: string = '';

    @provide({ context: formState })
    @state()
    formState: answerData = {};

    private pageIdStack: string[] = [];

    render() {
        console.log(this.config);

        const contentPages = this.config?.contentPages;

        if (!contentPages?.length) {
            return html``;
        }

        if (!this.pageId) {
            this.pageId = contentPages[0].$id;
        }

        const completePages = this.config?.completePages ?? [];

        const customCss = html`<style>
            h1 {
                text-align: center;
            }
        </style>`;

        const currentPage = contentPages.find((x) => x.$id === this.pageId);

        if (currentPage) {
            return html` <div>${keyed(this.pageId, html`<pt-form-page .page=${currentPage}></pt-form-page>`)}</div>
                <div class="flex justify-center items-center ">
                    <button class="py-2 px-4" type="button" @click=${this.prePage}>Pre</button>

                    <button type="button" class="py-2 px-4" @click=${this.nextPage}>Next</button>
                </div>`;
        } else {
            const completePage = completePages.find((x) => x.$id == this.pageId);
            return html`<pt-form-complete-page .page=${completePage!}></pt-form-complete-page>`;
        }
    }

    private onSubmit(e: Event) {
        console.log(`submit form data ${JSON.stringify(this.formState)}`);

        const options = {
            detail: this.formState,
            bubbles: true,
            composed: true,
        };

        this.dispatchEvent(new CustomEvent('pt-form-submit', options));
    }

    private prePage() {
        if (this.pageIdStack.length) {
            this.pageId = this.pageIdStack.pop()!;
        }
    }

    private nextPage() {
        this.pageIdStack.push(this.pageId);
        const contentPages = this.config?.contentPages!;
        const currentPage = contentPages.find((x) => x.$id == this.pageId);
        const nextButton = currentPage?.nextButton!;

        const nextAction = nextButton.action;

        if (nextAction == 'conditional') {
            const satisfiedCondition = nextButton.conditionalAction?.find((x) =>
                validateLogic(this.config!, x.condition!, this.formState)
            );
            if (satisfiedCondition) {
                const targePage = (satisfiedCondition.action![0].goToPage as ConceptRef).$id;
                this.pageId = targePage;
                return;
            }
        } else if (nextAction == 'goToPage') {
            const targePage = (nextButton.targetPage as ConceptRef).$id;
            this.pageId = targePage;
            return;
        }

        const currentPageIndex = contentPages.findIndex((x) => x.$id == this.pageId);

        if (currentPageIndex < contentPages.length - 1) {
            this.pageId = contentPages[currentPageIndex + 1].$id;
        } else {
            this.pageId = this.config?.completePages[0].$id!;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form': PtForm;
    }
}
