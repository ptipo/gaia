import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData, QuestionState } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import './pt-question-base';

@customElement('pt-qa')
export class PtQA extends PtBaseData<string> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['QAQuestion'];

    mandatoryErrorMessage = 'Please fill this in';

    connectedCallback() {
        super.connectedCallback();

        if (!this.value.data && this.data?.default) {
            this.value.data = this.data.default;
        }
    }

    render() {
        const description = this.data?.description;
        const placeholder = this.data?.placeholder;

        return html`<pt-question
            @input=${(e: any) => this.onChange(e.target.value)}
            description=${description!}
            placeholder=${placeholder!}
        ></pt-question> `;
    }

    isValidated() {
        return this.data?.required ? !!this.value.data : true;
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }
}
