import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData, PtFormSingleChoiceSelectedEventName } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { when } from 'lit/directives/when.js';

type ChoiceQuestionType = AllPageItemsTypesMap['ChoiceQuestion'];

type GetArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;

@customElement('pt-choice')
export class PtChoice extends PtBaseData<Map<string, string>> {
    @property({ type: Object })
    data?: ChoiceQuestionType;

    override mandatoryErrorMessage = 'Please make the selection';

    randomSeed?: number[];

    get isImageChoice() {
        return this.data?.choiceKind == 'image';
    }

    connectedCallback() {
        super.connectedCallback();
        const choiceLength = this.isImageChoice ? this.data?.imageChoices?.length : this.data?.textChoices?.length;
        this.randomSeed = new Array(choiceLength!).fill(0).map((x) => Math.random() - 0.5);
    }

    getInputComponent(
        choice: GetArrayElementType<
            NonNullable<ChoiceQuestionType['textChoices'] | ChoiceQuestionType['imageChoices']>
        >,
        isSingleChoice: boolean
    ) {
        return html` <input
            id="${choice.$id}"
            type="${isSingleChoice ? 'radio' : 'checkbox'}"
            name="choices"
            value="${choice.value}"
            ?checked=${this.value ? this.value.data!.has(choice.$id) : choice.defaultSelected}
            @change=${(e: any) => this.onChange(e)}
            class="mr-2 mt-1 w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked
            required
        />`;
    }

    render() {
        const targetChoices = this.isImageChoice ? this.data?.imageChoices : this.data?.textChoices;
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
        const isShowTextWithImage = this.data?.showTextWithImage;

        return html`
            <fieldset class="flex">
                <legend class="mb-8 text-2xl  text-black font-black	">${this.data?.question}</legend>
                ${description ? html`<p class="mt-2 text-s text-gray-600">${description}</p>` : ''}
                <div class="flex flex-auto flex-wrap gap-4 ${isFlat ? '' : 'flex-col'} items-stretch">
                    ${choices!.map(
                        (choice) => html`
                            ${when(
                                this.isImageChoice,
                                () =>
                                    html`
                                        <div
                                            class="flex flex-auto gap-y-4 flex-col justify-center items-center ${isFlat
                                                ? 'w-60'
                                                : 'max-w-full'}  border rounded-md border-gray-300 p-2 has-[:checked]:bg-gray-100 has-[:checked]:border-black hover:bg-gray-100  transition"
                                        >
                                            <div class="flex flex-auto items-center">
                                                <label
                                                    for="${choice.$id}"
                                                    class="flex items-center flex-col  gap-y-4 cursor-pointer"
                                                >
                                                    <div>
                                                        <img
                                                            class="max-w-full max-h-full h-auto"
                                                            src="${choice.source || choice.value}"
                                                        />
                                                    </div>
                                                </label>
                                            </div>
                                            <div
                                                class="flex ${isShowTextWithImage
                                                    ? 'justify-start'
                                                    : 'justify-center'}  mt-2 w-full ${isFlat && isShowTextWithImage
                                                    ? 'min-h-12'
                                                    : ''} "
                                            >
                                                ${this.getInputComponent(choice, isSingleChoice)}
                                                ${when(
                                                    this.data?.showTextWithImage,
                                                    () => html`<label>${choice.name}</label>`
                                                )}
                                            </div>
                                        </div>
                                    `,
                                () =>
                                    html`
                                        <div class="flex-auto">
                                            <label
                                                class="flex items-center  border rounded-md border-gray-300 p-2 has-[:checked]:bg-gray-100 has-[:checked]:border-black hover:bg-gray-100 cursor-pointer transition"
                                            >
                                                ${this.getInputComponent(choice, isSingleChoice)}
                                                <label
                                                    for="${choice.$id}"
                                                    class="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    ${choice.value}
                                                </label>
                                            </label>
                                            ${choice.additionalInput && this.value.data!.has(choice.$id)
                                                ? html`<textarea
                                                      data-choice-id="${choice.$id}"
                                                      @input=${this.onInputChange}
                                                      .value=${this.value.data?.get(choice.$id)!}
                                                  ></textarea>`
                                                : ''}
                                        </div>
                                    `
                            )}
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

            const isSingleChoice = this.data?.kind == 'single';
            if (isSingleChoice) {
                this.value.data!.clear();
            }
            this.value.data!.set(choice!.$id, '');

            if (isSingleChoice) {
                this.dispatchEvent(
                    new CustomEvent(PtFormSingleChoiceSelectedEventName, { bubbles: true, composed: false })
                );
            }
        } else {
            this.value.data!.delete(choice!.$id);
        }

        this.requestUpdate();
    }

    onInputChange(e: Event) {
        const input = e.target as HTMLTextAreaElement;
        const value = input.value;
        const choiceId = input.dataset.choiceId!;
    }

    isValidated() {
        return this.data?.required ? this.value.data!.size > 0 : true;
    }

    override isEmptyData() {
        return !this.value.data?.size;
    }
}
