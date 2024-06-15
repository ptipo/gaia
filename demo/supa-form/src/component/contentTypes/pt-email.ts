import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import './pt-question-base';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('pt-email')
export class PtEmail extends PtBaseData<string> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['EmailQuestion'];

    mandatoryErrorMessage = 'Please fill this in';

    render() {
        const description = this.data?.description;

        return html`<pt-question
            @input=${(e: any) => this.onChange(e.target.value)}
            description=${description!}
            value=${ifDefined(this.value.data)}
        ></pt-question> `;
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

    override getValidateError() {
        let baseError = super.getValidateError();

        if (baseError) {
            return baseError;
        }

        if (!this.isValidEmail(this.value.data!)) {
            return 'Please enter a valid email';
        }
    }

    onChange(value: string) {
        this.value!.data = value;
        this.requestUpdate();
    }
}
