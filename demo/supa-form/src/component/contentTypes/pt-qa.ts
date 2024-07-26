import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormSubmitData, PtBaseData, QuestionState } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import './pt-question-base';
import { ifDefined } from 'lit/directives/if-defined.js';
import { msg } from '@lit/localize';

@customElement('pt-qa')
export class PtQA extends PtBaseData<string> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['QAQuestion'];

    mandatoryErrorMessage = msg('Please fill this in');

    connectedCallback() {
        super.connectedCallback();

        if (!this.value.data && this.data?.default) {
            this.value.data = this.data.default;
        }
    }

    render() {
        const description = this.data?.description;
        const placeholder = this.data?.placeholder;
        const question = this.data?.question;

        return html`<pt-question
            @input=${(e: any) => this.onChange(e.target.value)}
            question=${question!}
            description=${description!}
            placeholder=${placeholder!}
            config-path=${this.configPath}
            value=${ifDefined(this.value.data)}
        ></pt-question> `;
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }

    override getSubmitData() {
        return { name: this.data?.name!, value: this.value.data!, saveUserTag: this.data?.saveAsUserTag };
    }
}
