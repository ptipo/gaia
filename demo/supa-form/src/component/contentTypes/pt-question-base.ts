import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';

@customElement('pt-question')
export class PtQuestionBase extends PtBase {
    @property()
    question?: string;

    @property()
    description?: string;

    @property()
    placeholder?: string;

    render() {
        return html`
            ${this.description ? html`<p class="text-sm text-gray-500 mb-2">${this.description}</p>` : ''}
            <span class="mb-8 text-2xl  text-black font-black	">${this.question}</span>

            <div class="mt-4">
                <span>
                    <input class="w-full text-lg" placeholder="${this.placeholder ? this.placeholder : ''}" />
                </span>
            </div>
        `;
    }
}
