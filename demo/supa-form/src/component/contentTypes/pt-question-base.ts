import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PtBase } from '../pt-base';
import './pt-editable-label';

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

    @property({ type: String, attribute: 'config-path' })
    configPath = '';

    render() {
        return html`
            <span class="text-xl font-bold pt-question block"
                ><pt-editable-label
                    config-path="${this.configPath + '.question'}"
                    label="${this.question!}"
                ></pt-editable-label
            ></span>
            ${this.description
                ? html`<p class="mt-1 text-sm font-normal pt-question-description">
                      <pt-editable-label config-path="${this.configPath + '.description'}" label="${this.description}">
                      </pt-editable-label>
                  </p>`
                : ''}
            <div class="mt-4">
                <span>
                    <input
                        class="pt-question-answer w-full text-sm placeholder-gray-400 appearance-none ml-0 mr-[0.6em] my-0 px-[0.2em] py-[0.16em] rounded-none border-0 border-b border-solid outline-none "
                        value=${ifDefined(this.value)}
                        placeholder=${ifDefined(this.placeholder)}
                        type=${this.inputType}
                    />
                </span>
            </div>
        `;
    }
}
