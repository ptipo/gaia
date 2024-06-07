import { customElement, property, state } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import 'copy-component';

@customElement('pt-copy-to-clipboard')
export class PtCopyToClipboard extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['CopyToClipboard'];

    @state()
    isCopied = false;

    render() {
        const content = this.data?.content;

        return html` <copy-component @copy=${this.onCopy.bind(this)}>
            <div class="inline-flex items-center gap-x-3">
                <div id="hs-clipboard-basic" class="text-sm font-medium text-gray-800 dark:text-white">${content}</div>
                <button
                    slot="button"
                    type="button"
                    class="p-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                        class="${!this.isCopied && 'hidden'} size-4 text-blue-600"
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
        </copy-component>`;
    }

    private onCopy() {
        this.isCopied = true;
    }
}
