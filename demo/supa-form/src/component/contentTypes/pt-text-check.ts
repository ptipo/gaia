import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { PtBaseData } from '../pt-base';
import { msg } from '@lit/localize';
import { isNullOrEmpty } from '../../util/model-util';

@customElement('pt-text-check')
class PtTextCheck extends PtBaseData<boolean> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['TextCheckElement'];

    //TODO: set from configurator
    @property({ type: Array })
    pageAnswerItemIds: string[] = [];

    override getValidateError() {
        let baseError = super.getValidateError();

        if (baseError) {
            return baseError;
        }

        const isAnyDataFilled = this.pageAnswerItemIds.some((id) => !isNullOrEmpty(this.formState.answers[id].data));

        if (isAnyDataFilled && this.value.data != true) {
            return this.mandatoryErrorMessage;
        }
    }

    mandatoryErrorMessage = msg('Please agree to the terms & conditions');

    getSubmitData() {
        return null;
    }

    render() {
        const id = this.data?.$id!;
        const isChecked = this.value.data != undefined ? this.value.data : this.data?.defaultSelected;
        return html` <div class="w-full flex pt-text cursor-pointer transition ">
            <input
                id=${id}
                type="checkbox"
                class="mr-2 mt-1 w-4 h-4 cursor-pointer text-black border-gray-300 focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ?checked=${isChecked}
                @change=${(e: any) => this.onChange(e)}
            />
            <label class="cursor-pointer" for="${id}">${unsafeHTML(this.data?.content)}</label>
        </div>`;
    }

    onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value.data = input.checked;
        this.requestUpdate();
    }
}
