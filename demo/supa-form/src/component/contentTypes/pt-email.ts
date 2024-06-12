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

        return html` ${description ? html`<p class="text-sm text-gray-500 mb-2">${description}</p>` : ''}
            <span class="mb-8 text-2xl  text-black font-black	">${this.data?.question}</span>

            <div class="mt-4">
                <span>
                    <input
                        class="w-full text-lg"
                        type="email"
                        @input=${(e: any) => this.onChange(e.target.value)}
                        placeholder="please input your email"
                    />
                </span>
            </div>`;
    }

    isValidated() {
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
