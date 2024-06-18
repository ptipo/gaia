import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('pt-question')
export class PtQuestionBase extends PtBase {
    @property()
    question?: string;

    @property()
    description?: string;

    @property()
    placeholder?: string;

    @property()
    value?: string;

    render() {
        return html`
            ${this.description ? html`<p class="text-sm text-gray-500 mb-2">${this.description}</p>` : ''}
            <span class="mb-8 text-2xl  text-black font-black">${this.question}</span>

            <div class="mt-4">
                <span>
                    <input
                        class="w-full text-lg"
                        value=${ifDefined(this.value)}
                        placeholder=${ifDefined(this.placeholder)}
                    />
                </span>
            </div>
        `;
    }
}
