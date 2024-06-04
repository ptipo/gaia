import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-email')
class PtEmail extends PtBaseData {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['EmailQuestion'];

    @property()
    value?: string;

    render() {
        return html`
        <div class="mb-5">
        <label for="${this.data
            ?.$id!}"  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input type="email" id="${this.data?.$id!}" @change=${(e: any) => this.onChange(e.target.value)} .value=${this
            .value!} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@abc.com" required />
        </div>`;
    }

    onChange(value: string) {
        this.value = value;
    }
}
