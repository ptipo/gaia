import { ConceptRef, createSelectionChangeEvent } from '@hayadev/configurator';
import { provide } from '@lit/context';
import { msg } from '@lit/localize';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { app } from '../app';
import { CompletePage } from '../config/page/complete-page';
import { ContentPage } from '../config/page/content-page';
import { FormAnswerData, formState } from '../state';
import { validateLogic } from '../util/logic-resolver';
import { ERROR_MESSAGE_CLASS } from './constant';
import { setLocale } from './localization';
import { PtBaseShadow } from './pt-base';
import './pt-form-complete-page';
import './pt-form-page';
import { PtFormPage } from './pt-form-page';
import { StorageWrapper } from './storage-wrapper';

type retention = NonNullable<typeof app.model.dataCollection.drip.retention>;
type autoCollect = NonNullable<typeof app.model.dataCollection.autoCollect>;

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
                const { error, model, appVersion } = app.loadModel(value);
                if (error) {
                    console.warn('Error loading model', error.message);
                    return;
                }
                console.log('Loaded model', model);
                console.log('Model app version', appVersion);

                const language = model.languageSettings.language;

                if (language) {
                    setLocale(language);
                }
                return model;
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
        // re-render the application every time a new locale successfully loads.
        // needed for the first render in the editor
        window.addEventListener('lit-localize-status', (event) => {
            if (event.detail.status === 'ready') {
                console.log(`Loaded new locale: ${event.detail.readyLocale}`);
                this.requestUpdate();
            }
        });

        this.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission
                this.nextPage();
            }
        });
    }

    render() {
        const contentPages = this.config?.contentPages;

        const dataCollection = this.config?.dataCollection;

        const dataRetention = dataCollection?.drip.retention;

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

        this.saveUrlInFormState();

        if (!contentPages?.length) {
            return html``;
        }

        if (!this.pageId) {
            this.pageId = contentPages[0].$id;
            // send an initial page change event
            this.emitPageChangeEvent('content', this.pageId);
        }

        const completePages = this.config?.completePages ?? [];
        const css = html`<style>
            ${this.config?.customCSS?.source}
        </style>`;

        if (this.currentContentPage) {
            const progress: number = this.getCurrentProgress() * 100;

            return html`${css}
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
                        ${when(
                            this.editSelection || this.pageIdStack.length > 0,
                            () =>
                                html` <button type="button" @click=${this.prePage} class="text-gray-500">
                                    ${msg('Back')}
                                </button>`
                        )}

                        <span class="w-44 max-w-[33%] mr-10">
                        <button @click=${
                            this.nextPage
                        } class="bg-black text-white w-full py-2 px-4 rounded hover:bg-gray-800 mr-10 ml-auto" >${msg(
                'NEXT'
            )}</button>
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
        const formResult = this.getFormResultFromState();
        console.log(`form result: ${JSON.stringify(formResult)}`);

        this.dispatchEvent(
            new CustomEvent(isComplete ? 'form-answer' : 'form-complete', {
                detail: formResult.submitData,
                bubbles: true,
                composed: true,
            })
        );

        if (Object.keys(formResult.saveUserTag).length > 0) {
            this.dispatchEvent(
                new CustomEvent('save-user-tag', {
                    detail: formResult.saveUserTag,
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private prePage() {
        if (this.editSelection) {
            const contentPages = this.config?.contentPages!;

            const currentPageIndex = contentPages.findIndex((x) => x.$id == this.pageId);

            if (currentPageIndex != 0) {
                this.pageId = contentPages[currentPageIndex - 1].$id;
            }

            this.emitPageChangeEvent('content', this.pageId);
        } else {
            if (this.pageIdStack.length) {
                this.pageId = this.pageIdStack.pop()!;
            }
        }
    }

    private async nextPage() {
        const contentPages = this.config?.contentPages!;
        const completePages = this.config?.completePages!;

        if (this.editSelection) {
            const currentPageIndex = contentPages
                .map((x) => x.$id)
                .concat(completePages.map((x) => x.$id)!)
                .indexOf(this.pageId);

            if (currentPageIndex < contentPages.length - 1) {
                this.pageId = contentPages[currentPageIndex + 1].$id;
                this.emitPageChangeEvent('content', this.pageId);
            } else {
                this.pageId = completePages[0].$id!;
                this.emitPageChangeEvent('complete', this.pageId);
            }
            return;
        }

        const isValid = await this.pageRef.value?.validatePage();

        if (!isValid) {
            console.error('page is not valid');
            const firstError = this.renderRoot.querySelector(`.${ERROR_MESSAGE_CLASS}`);

            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        this.pageIdStack.push(this.pageId);
        const nextButton = this.currentContentPage?.nextButton!;

        const nextAction = nextButton.action;
        let targetPage;

        if (nextAction == 'conditional') {
            const satisfiedCondition = nextButton.conditionalAction?.find((x) =>
                validateLogic(this.config!, x.condition!, this.formState.answers)
            );
            if (satisfiedCondition) {
                targetPage = (satisfiedCondition.action![0].goToPage as ConceptRef).$id;
                this.pageId = targetPage;
            }
        } else if (nextAction == 'goToPage') {
            targetPage = (nextButton.targetPage as ConceptRef).$id;
            this.pageId = targetPage;
        }

        if (!targetPage) {
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

        // if need to go to the complete page
        const limitPagesPerDrip = this.config?.dataCollection.drip.limitPagesPerDrip;

        if (limitPagesPerDrip?.maxPagesPerDrip && this.pageIdStack.length >= limitPagesPerDrip.maxPagesPerDrip) {
            targetPage = (limitPagesPerDrip.dripCompletePage as ConceptRef).$id;
            this.pageId = targetPage;
        }
    }

    private onFormStateChange() {
        console.log('form state changed');
    }

    private getCurrentProgress(): number {
        const contentPages = this.config?.contentPages;
        const currentPageIndex = contentPages?.findIndex((x) => x.$id == this.pageId);

        return currentPageIndex != undefined ? (currentPageIndex + 1) / (contentPages!.length + 1) : 1;
    }

    private emitPageChangeEvent(pageType: 'content' | 'complete', newPageId: string) {
        // dispatch selection change event to the configurator at design time
        this.dispatchEvent(
            createSelectionChangeEvent({
                concept: pageType === 'content' ? ContentPage : CompletePage,
                id: newPageId,
            })
        );
    }

    private getFormResultFromState(): FormResultData {
        let submitData: { [key: string]: string } = {};
        const saveUserTag: { [key: string]: string } = {};

        const answers = this.formState.answers;
        for (const key in answers) {
            const data = this.formState.answers[key].submitData;
            if (data) {
                submitData[data.name] = data.value;
                if (data.saveUserTag) {
                    for (const tag of data.saveUserTag) {
                        saveUserTag[tag] = data.value;
                    }
                }
            }
        }

        const autoCollect = this.config?.dataCollection?.autoCollect;

        if (autoCollect?.landing_page_url && this.formState.landingPageUrl) {
            submitData['landing_page_url'] = this.formState.landingPageUrl;
        }

        if (autoCollect?.page_url && this.formState.pageUrl) {
            submitData['page_url'] = this.formState.pageUrl;
        }

        if (autoCollect?.utmParameters && this.formState.utmParameters) {
            submitData = { ...submitData, ...this.formState.utmParameters };
        }

        return { submitData, saveUserTag };
    }

    private saveUrlInFormState() {
        const currentUrl = window.location.href;
        // if entryPageUrl is not set, set it to the current location
        if (!this.formState.landingPageUrl) {
            this.formState.landingPageUrl = currentUrl;
        }

        this.formState.pageUrl = currentUrl;

        const utmParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const urlParams = new URLSearchParams(window.location.search);

        utmParameters.forEach((param) => {
            if (urlParams.has(param)) {
                if (!this.formState.utmParameters) {
                    this.formState.utmParameters = {};
                }
                this.formState.utmParameters[param] = urlParams.get(param)!;
            }
        });
    }
}

interface FormResultData {
    submitData: { [key: string]: string };
    saveUserTag: { [key: string]: string };
}

declare global {
    interface HTMLElementTagNameMap {
        'pt-form': PtForm;
    }
}
