import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { BasicData } from '..';
import { formState, stateData } from '../../state';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-qa')
class PtQA extends PtBaseData {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['QAQuestion'];

    @property()
    value?: string;

    render() {
        return html`<h2>${this.data!.question}</h2>
        <div class="col-span-full">
        <div class="mt-2">
          <textarea  @change=${(e: any) => this.onChange(e.target.value)} .value=${this
            .value!} rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
        </div>
      </div>`;
    }

    onChange(value: string) {
        this.value = value;
    }
}

interface QAQuestion extends BasicData {
    question: string;
}
