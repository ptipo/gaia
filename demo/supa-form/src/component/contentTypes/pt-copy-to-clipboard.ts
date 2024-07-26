import { customElement, property, state } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import './pt-copy-component';

@customElement('pt-copy-to-clipboard')
export class PtCopyToClipboard extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['CopyToClipboard'];

    @property({ type: String, attribute: 'data-haya-config-path' })
    configPath: string = '';

    @state()
    isCopied = false;

    render() {
        const content = this.data?.content;

        const align = this.data?.align || 'center';
        const maxWidth = this.data?.maxWidth || 100;

        return html` <pt-copy-component class="flex" style="justify-content:${align}" @copy=${this.onCopy.bind(this)}>
            <div class="inline-flex items-center gap-x-3 ">
                <div
                    id="hs-clipboard-basic"
                    class=" bg-white border break-words border-black  rounded-md px-4 py-2 text-sm font-medium  dark:text-white"
                    style="max-width:${maxWidth}%"
                    data-haya-config-path="${this.configPath + '.content'}"
                    data-haya-editable
                >
                    ${content}
                </div>
                <button
                    slot="button"
                    type="button"
                    class="p-2 inline-flex items-center text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                    <svg
                        class="${this.isCopied && 'hidden'} size-4 group-hover:rotate-6 transition"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    </svg>

                    <svg
                        class="${!this.isCopied && 'hidden'} size-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>
        </pt-copy-component>`;
    }

    private onCopy() {
        this.isCopied = true;
    }
}
