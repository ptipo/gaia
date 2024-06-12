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

        return html` ${description ? html`<p class="text-sm text-gray-500 mb-2">${description}</p>` : ''}
            <span class="mb-8 text-2xl  text-black font-black	">${this.data?.question}</span>

            <div class="mt-4">
                <span>
                    <input
                        class="w-full text-lg"
                        @input=${(e: any) => this.onChange(e.target.value)}
                        placeholder="${placeholder ? placeholder : ''}"
                    />
                </span>
            </div>`;
    }

    isValidated() {
        return this.data?.required ? !!this.value.data : true;
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }
}
