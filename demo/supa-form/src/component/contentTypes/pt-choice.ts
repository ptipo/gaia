import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData, QuestionState } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-choice')
export class PtChoice extends PtBaseData<Set<string>> {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['ChoiceQuestion'];

    randomSeed?: number[];

    connectedCallback() {
        super.connectedCallback();
        if (this.data?.randomOrder) {
            this.randomSeed = Array.from(this.data!.textChoices!, (x) => Math.random() - 0.5);
        }
    }

    render() {
        if (!this.value.data) {
            this.value.data = new Set([this.data!.textChoices!.find((x) => x.defaultSelected)!.$id]);
        }

        if (this.data?.required) {
            this.value.isValid = this.value.data.size > 0;
        }

        const isSingleChoice = this.data?.kind == 'single';
        const choices = this.data?.randomOrder
            ? this.data?.textChoices
                  ?.map((x, i) => ({ value: x, sort: this.randomSeed![i] }))
                  .sort((a, b) => a.sort - b.sort)
                  .map((x) => x.value)
            : this.data?.textChoices;

        const isFlat = this.data?.flatMode as boolean;
        const description = this.data?.description;

        return html`
            <fieldset>
                <legend>${this.data?.question}</legend>
                ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
                <div class="flex ${isFlat ? '' : 'flex-col'}">
                    ${choices!.map(
                        (x) => html`
                            <div class="flex items-center mb-4">
                                <input
                                    id="${x.$id}"
                                    type="${isSingleChoice ? 'radio' : 'checkbox'}"
                                    name="choices"
                                    value="${x.value}"
                                    ?checked=${this.value ? this.value.data!.has(x.$id) : x.defaultSelected}
                                    @change=${(e: any) => this.onChange(e)}
                                    class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                    checked
                                    required
                                />

                                <label
                                    for="${x.$id}"
                                    class="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    ${x.value}
                                </label>
                            </div>
                        `
                    )}
                </div>
            </fieldset>
        `;
    }

    onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const value = input.value;
        const isSelected = input.checked;
        const choice = this.data!.textChoices?.find((x) => x.value == value);

        if (isSelected) {
            const limitSelectedItems = this.data?.limitSelectedItems;

            if (limitSelectedItems && this.value.data!.size == limitSelectedItems) {
                input.checked = false;
                return;
            }
            this.value.data!.add(choice!.$id);
        } else {
            this.value.data!.delete(choice!.$id);
        }

        this.requestUpdate();
    }

    isValidate() {
        return this.data?.required ? this.value.data!.size > 0 : true;
    }
}
