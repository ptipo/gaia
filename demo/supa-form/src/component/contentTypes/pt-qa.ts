import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData, QuestionState } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-qa')
export class PtQA extends PtBaseData<string> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['QAQuestion'];

    connectedCallback() {
        super.connectedCallback();

        if (!this.value.data && this.data?.default) {
            this.value.data = this.data.default;
        }
    }

    render() {
        const description = this.data?.description;
        const placeholder = this.data?.placeholder;

        return html` <label
                for="${this.data?.$id!}"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >${this.data?.question}</label
            >
            ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
            <textarea
                id="${this.data?.$id!}"
                @input=${(e: any) => this.onChange(e.target.value)}
                .value=${this.value.data || ''}
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="${placeholder ? placeholder : ''}"
            ></textarea>`;
    }

    isValidate() {
        return this.data?.required ? !!this.value.data : true;
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }
}
