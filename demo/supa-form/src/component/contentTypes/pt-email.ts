import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-email')
export class PtEmail extends PtBaseData<string> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['EmailQuestion'];

    render() {
        const description = this.data?.description;

        return html` <div class="mb-5">
            <label for="${this.data?.$id!}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
            >
            ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
            <input
                type="email"
                id="${this.data?.$id!}"
                @input=${(e: any) => this.onChange(e.target.value)}
                .value=${this.value?.data || ''}
                class=" ${this.value?.data && !this.isValidate()
                    ? 'border-rose-600'
                    : ' border-gray-300'}  bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@abc.com"
                required
            />
        </div>`;
    }

    isValidate() {
        if (this.value.data) {
            return this.isValidEmail(this.value.data);
        } else {
            return !this.data?.required;
        }
    }

    isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }
}
