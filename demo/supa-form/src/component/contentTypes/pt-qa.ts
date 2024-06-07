import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-qa')
export class PtQA extends PtBaseData {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['QAQuestion'];

    @property()
    value?: string;

    render() {
        const description = this.data?.description;
        const placeholder = this.data?.placeholder;
        const defaultContent = this.data?.default;
        return html` <label
                for="${this.data?.$id!}"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >${this.data?.question}</label
            >
            ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
            <textarea
                id="${this.data?.$id!}"
                @change=${(e: any) => this.onChange(e.target.value)}
                .value=${this.value || defaultContent || ''}
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="${placeholder ? placeholder : ''}"
            ></textarea>`;
    }

    onChange(value: string) {
        this.value = value;
    }
}
