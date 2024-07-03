import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { app } from '../app';
import './pt-form-page';
import './pt-form-complete-page';
import { PtBaseShadow, QuestionState } from './pt-base';
import { provide } from '@lit/context';
import { formState, answerData, FormAnswerData } from '../state';
import { keyed } from 'lit/directives/keyed.js';
import { validateLogic } from '../util/logic-resolver';
import { ConceptRef } from '@hayadev/configurator';
import { PtFormPage } from './pt-form-page';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { setLocale } from './localization';
import { StorageWrapper } from './storage-wrapper';

type retention = NonNullable<typeof app.model.dataCollection.drip.retention>;

@customElement('pt-form')
export class PtForm extends PtBaseShadow {
    @property()
    name?: string;

    private _editSelection?: { id: string };

    @property({ type: Object, attribute: 'edit-selection' })
    set editSelection(value: { id: string }) {
        this._editSelection = value;
        this.pageId = value.id;
    }

    get editSelection(): { id: string } | undefined {
        return this._editSelection;
    }

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

    get currentContentPage() {
        return this.config?.contentPages.find((x) => x.$id == this.pageId);
    }

    @provide({ context: formState })
    @state()
    formState: FormAnswerData = { answers: {} };

    private pageIdStack: string[] = [];

    pageRef: Ref<PtFormPage> = createRef();

    private storageWrapper?: StorageWrapper;

    private retentionMap: Map<retention, number> = new Map([
        ['once', 0],
        ['oneDay', 24 * 60 * 60 * 1000],
        ['oneWeek', 7 * 24 * 60 * 60 * 1000],
        ['oneMonth', 30 * 24 * 60 * 60 * 1000],
        ['forever', Infinity],
    ]);

    get storageKey() {
        return `pt-form-${this.config?.$id}`;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission
                this.nextPage();
            }
        });
    }

    render() {
        console.log(this.config);

        const contentPages = this.config?.contentPages;

        const dataRetention = this.config?.dataCollection.drip.retention;

        if (dataRetention && !this.storageWrapper) {
            const loadStorageWrapper = new StorageWrapper();
            const loadedFromState = loadStorageWrapper.get(this.storageKey);

            if (loadedFromState) {
                // load form state from storage
                this.storageWrapper = loadStorageWrapper;
                this.formState = loadedFromState;

                if (this.formState.currentPageId) {
                    // check if the last saved page is still in the content pages
                    if (contentPages?.find((x) => x.$id == this.formState.currentPageId)) {
                        this.pageId = this.formState.currentPageId;
                    }
                }
            } else {
                if (dataRetention == 'once') {
                    this.storageWrapper = new StorageWrapper('sessionstorage');
                } else {
                    this.storageWrapper = new StorageWrapper('localstorage', this.retentionMap.get(dataRetention));
                }
            }
        }

        const language = this.config?.languageSettings.language;

        if (language) {
            setLocale(language);
        }

        if (!contentPages?.length) {
            return html``;
        }

        if (!this.pageId) {
            this.pageId = contentPages[0].$id;
        }

        const completePages = this.config?.completePages ?? [];

        if (this.currentContentPage) {
            const progress: number = this.getCurrentProgress() * 100;

            return html`
            
                    <div>
                        <div class="sticky top-0 h-8 bg-white opacity-100">
                            <div class="flex flex-col h-full justify-center">
                                <div
                                    class="flex h-1 bg-gray-200  rounded-full overflow-hidden dark:bg-neutral-700 w-[calc(100%_-_5rem)] ml-auto mr-auto"
                                    role="progressbar">
                                    <div
                                        class="flex flex-col justify-center rounded-full overflow-hidden bg-black text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
                                        style="width: ${progress}%">
                                    </div>
                              </div>
                        </div>
                        </div>
                        ${keyed(
                            this.pageId,
                            html`<pt-form-page
                                ${ref(this.pageRef)}
                                class="mt-4 block"
                                @pt-form-state-changed=${this.onFormStateChange}
                                @pt-form-next-page=${this.nextPage}
                                .page=${this.currentContentPage}
                            ></pt-form-page>`
                        )}
                    </div>
                    <div class="sticky bg-white opacity-90 w-full h-20  bottom-0 ">
                        <div class="flex h-full items-center justify-end gap-x-8">
                        <button type="button" @click=${this.prePage} class="text-gray-500">Back</button>
                            <span class="w-44 max-w-[33%] mr-10">
                        <button @click=${
                            this.nextPage
                        } class="bg-black text-white w-full py-2 px-4 rounded hover:bg-gray-800 mr-10 ml-auto" >NEXT</button>
                        </span>
                        </div>
                    </div>
                 
                </div>
            `;
        } else {
            this.submitPage(true);
            const completePage = completePages.find((x) => x.$id == this.pageId);
            return html`<pt-form-complete-page .page=${completePage!}></pt-form-complete-page>`;
        }
    }

    private submitPage(isComplete: boolean = false) {
        const submitData = this.getSubmitDataFromState();
        console.log(`submit form data ${JSON.stringify(submitData)}`);

        const options = {
            detail: submitData,
            bubbles: true,
            composed: true,
        };

        this.dispatchEvent(new CustomEvent(isComplete ? 'form-answer' : 'form-complete', options));
    }

    private prePage() {
        if (this.editSelection) {
            const contentPages = this.config?.contentPages!;

            const currentPageIndex = contentPages.findIndex((x) => x.$id == this.pageId);

            if (currentPageIndex != 0) {
                this.pageId = contentPages[currentPageIndex - 1].$id;
            }
        } else {
            if (this.pageIdStack.length) {
                this.pageId = this.pageIdStack.pop()!;
            }
        }
    }

    private async nextPage() {
        const contentPages = this.config?.contentPages!;
        const completePages = this.config?.completePages!;

        const currentPageId = this.pageId;

        if (this.editSelection) {
            const currentPageIndex = contentPages
                .map((x) => x.$id)
                .concat(completePages.map((x) => x.$id)!)
                .indexOf(this.pageId);

            this.pageId =
                currentPageIndex < contentPages.length - 1
                    ? contentPages[currentPageIndex + 1].$id
                    : completePages[0].$id!;

            return;
        }

        const isValid = await this.pageRef.value?.validatePage();

        if (!isValid) {
            console.error('page is not valid');
            return;
        }

        this.pageIdStack.push(this.pageId);
        const nextButton = this.currentContentPage?.nextButton!;

        const nextAction = nextButton.action;

        if (nextAction == 'conditional') {
            const satisfiedCondition = nextButton.conditionalAction?.find((x) =>
                validateLogic(this.config!, x.condition!, this.formState)
            );
            if (satisfiedCondition) {
                const targePage = (satisfiedCondition.action![0].goToPage as ConceptRef).$id;
                this.pageId = targePage;
            }
        } else if (nextAction == 'goToPage') {
            const targePage = (nextButton.targetPage as ConceptRef).$id;
            this.pageId = targePage;
        } else {
            const currentPageIndex = contentPages.findIndex((x) => x.$id == this.pageId);

            if (currentPageIndex < contentPages.length - 1) {
                this.pageId = contentPages[currentPageIndex + 1].$id;
            } else {
                this.pageId = completePages[0].$id!;
            }
        }

        this.submitPage();
        // save form state to storage
        this.formState.currentPageId = this.pageId;
        this.storageWrapper?.set(this.storageKey, this.formState);
    }

    private onFormStateChange() {
        console.log('form state changed');
    }

    private isCompletePage(pageId: string) {
        return this.config?.completePages.find((x) => x.$id == pageId);
    }

    private getCurrentProgress(): number {
        const contentPages = this.config?.contentPages;
        const currentPageIndex = contentPages?.findIndex((x) => x.$id == this.pageId);

        return currentPageIndex != undefined ? (currentPageIndex + 1) / (contentPages!.length + 1) : 1;
    }

    private emitPageChangeEvent(currentPageId: string, nextPageId: string) {
        const options = {
            detail: { currentPageId, nextPageId },
            bubbles: true,
            composed: true,
        };

        this.dispatchEvent(new CustomEvent('form-page-change', options));
    }

    private getSubmitDataFromState() {
        const result: { [key: string]: string } = {};

        for (const key in this.formState.answers) {
            const submitData = this.formState.answers[key].submitData;
            if (submitData) {
                result[submitData.name] = submitData.value;
            }
        }
        return result;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form': PtForm;
    }
}
