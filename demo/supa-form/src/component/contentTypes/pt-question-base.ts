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

    @property()
    inputType: 'email' | 'text' = 'text';

    render() {
        return html`
            <span class="text-2xl font-bold">${this.question}</span>
            ${this.description ? html`<p class="mt-1 text-sm font-normal">${this.description}</p>` : ''}
            <div class="mt-4">
                <span>
                    <input
                        class="w-full text-lg border-b-gray-400 focus:border-gray-400 appearance-none bg-transparent text-[0.72em] font-black ml-0 mr-[0.6em] my-0 px-[0.2em] py-[0.16em] rounded-none border-0 border-b border-solid outline-none "
                        value=${ifDefined(this.value)}
                        placeholder=${ifDefined(this.placeholder)}
                        type=${this.inputType}
                    />
                </span>
            </div>
        `;
    }
}
