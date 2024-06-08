import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { ImageInfo } from '@gaia/configurator/items';

@customElement('pt-choice')
export class PtChoice extends PtBaseData<Map<string, string>> {
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
        const isImageChoice = this.data?.choiceKind == 'image';
        const targetChoices = isImageChoice ? this.data?.imageChoices : this.data?.textChoices;
        if (!this.value.data) {
            this.value.data = new Map(
                targetChoices!
                    .filter((x) => x.defaultSelected)
                    .map((x) => x.$id)
                    .map((x) => [x, x])
            );
        }

        if (this.data?.required) {
            this.value.isValid = this.value.data.size > 0;
        }

        const isSingleChoice = this.data?.kind == 'single';

        const choices = this.data?.randomOrder
            ? targetChoices
                  ?.map((x, i) => ({ value: x, sort: this.randomSeed![i] }))
                  .sort((a, b) => a.sort - b.sort)
                  .map((x) => x.value)
            : targetChoices;

        const isFlat = this.data?.flatMode as boolean;
        const description = this.data?.description;

        return html`
            <fieldset>
                <legend>${this.data?.question}</legend>
                ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
                <div class="flex ${isFlat ? '' : 'flex-col'}">
                    ${choices!.map(
                        (x) => html`
                            <div>
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
                                    ${isImageChoice
                                        ? html` <img
                                              class="max-w-sm object-cover object-center"
                                              src="${(x.value as ImageInfo).url}"
                                          />`
                                        : html`<label
                                              for="${x.$id}"
                                              class="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300"
                                          >
                                              ${x.value}
                                          </label>`}
                                </div>
                                ${x.additionalInput && this.value.data!.has(x.$id)
                                    ? html`<textarea
                                          data-choice-id="${x.$id}"
                                          @input=${this.onInputChange}
                                          .value=${this.value.data?.get(x.$id)!}
                                      ></textarea>`
                                    : ''}
                            </div>
                        `
                    )}
                </div>
            </fieldset>
        `;
    }

    onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const isSelected = input.checked;

        const isImageChoice = this.data?.choiceKind == 'image';
        const targetChoices = isImageChoice ? this.data?.imageChoices : this.data?.textChoices;
        const choice = targetChoices?.find((x) => x.$id == input.id);

        if (isSelected) {
            const limitSelectedItems = this.data?.limitSelectedItems;

            if (limitSelectedItems && this.value.data!.size == limitSelectedItems) {
                input.checked = false;
                return;
            }
            this.value.data!.set(choice!.$id, '');
        } else {
            this.value.data!.delete(choice!.$id);
        }

        this.requestUpdate();
    }

    onInputChange(e: Event) {
        const input = e.target as HTMLTextAreaElement;
        const value = input.value;
        const choiceId = input.dataset.choiceId!;

        this.value.data!.set(choiceId, value);

        console.log(this.value.data);
    }

    isValidated() {
        return this.data?.required ? this.value.data!.size > 0 : true;
    }
}
