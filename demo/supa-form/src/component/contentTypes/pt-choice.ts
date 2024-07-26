import { ImageInfo } from '@hayadev/configurator/items';
import { consume } from '@lit/context';
import { msg } from '@lit/localize';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import PlaceholderImage from '../../../assets/placeholder-md.svg?raw';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { formWidth } from '../../state';
import { PtBaseData, PtFormSingleChoiceSelectedEventName } from '../pt-base';
import './pt-question-base';

type ChoiceQuestionType = AllPageItemsTypesMap['ChoiceQuestion'];

type GetArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;

@customElement('pt-choice')
export class PtChoice extends PtBaseData<Array<[string, string]>> {
    @property({ type: Object })
    data?: ChoiceQuestionType;

    @consume({ context: formWidth, subscribe: true })
    widthLevel = 2;

    override mandatoryErrorMessage = msg('Please make the selection');

    private mandatoryInputErrorMessage = msg('Please provide more information');

    randomSeed?: number[];

    get isImageChoice() {
        return this.data?.choiceKind == 'image';
    }

    get targetChoices() {
        return this.isImageChoice ? this.data?.imageChoices : this.data?.textChoices;
    }

    imageSkeleton = html`
        <div role="status" class="pt-choice-skeleton max-w-full max-h-full h-auto w-60 animate-pulse flex items-center">
            <div class="flex items-center justify-center w-full max-w-full h-48 rounded sm:w-96">
                ${unsafeHTML(PlaceholderImage)}
            </div>
            <span class="sr-only">loading</span>
        </div>
    `;

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
        const isChecked = this.isChoiceChecked(choice.$id);
        return html`<input
            id="${choice.$id}"
            type="${isSingleChoice ? 'radio' : 'checkbox'}"
            name="${this.data?.$id!}"
            ?checked=${this.value ? isChecked : choice.defaultSelected}
            @change=${(e: any) => this.onChange(e)}
            class="mr-2 w-4 h-4 cursor-pointer text-black border-gray-300 focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked
            required
        />`;
    }

    imageLoad(e: Event) {
        const img = e.target as HTMLImageElement;
        img.classList.remove('hidden');
        img.parentElement?.querySelector('.pt-choice-skeleton')?.classList.add('hidden');
    }

    render() {
        if (!this.value.data) {
            this.value.data = this.targetChoices!.filter((x) => x.defaultSelected)
                .map((x) => x.$id)
                .map((x) => [x, '']);
        }

        const isSingleChoice = this.data?.kind == 'single';

        const choices = this.data?.randomOrder
            ? this.targetChoices
                  ?.map((x, i) => ({ value: x, sort: x.additionalInput ? i : this.randomSeed![i] }))
                  .sort((a, b) => a.sort - b.sort)
                  .map((x) => x.value)
            : this.targetChoices;

        const isFlat = this.data?.flatMode as boolean;
        const description = this.data?.description;
        const isShowTextWithImage = this.data?.showTextWithImage;

        return html`
            <fieldset class="flex">
                <legend class="mb-5">
                    <span class="text-xl font-bold">${this.data?.question}</span>
                    ${description ? html`<p class="mt-1 text-sm font-normal">${description}</p>` : ''}
                </legend>

                <div class="flex flex-auto flex-wrap gap-2 ${isFlat ? '' : 'flex-col'} items-stretch">
                    ${choices!.map(
                        (choice) => html`
                            ${when(
                                this.isImageChoice,
                                () =>
                                    html`
                                        <label
                                            style="${isFlat
                                                ? `width: calc(${(1 / this.widthLevel) * 100}% - 0.5rem);`
                                                : ''}"
                                            class="flex cursor-pointer gap-y-4 flex-col justify-center items-center border rounded-md p-2.5 bg-gray-50 hover:bg-gray-100  has-[:checked]:border-black  transition"
                                        >
                                            <div class="flex flex-auto items-center w-full">
                                                <div class="flex items-center flex-col w-full gap-y-4 cursor-pointer">
                                                    ${this.imageSkeleton}
                                                    <img
                                                        @load=${this.imageLoad}
                                                        class="pt-choice-image hidden max-w-full max-h-full h-auto"
                                                        src="${typeof choice.value === 'string'
                                                            ? choice.value
                                                            : choice.value!.url}"
                                                    />
                                                </div>
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
                                                    // make line-height 1 to align with the input box
                                                    () =>
                                                        html`<label
                                                            for="${choice.$id}"
                                                            class="cursor-pointer leading-none"
                                                            >${choice.name}</label
                                                        >`
                                                )}
                                            </div>
                                        </label>
                                    `,
                                () =>
                                    html`
                                        <label
                                            class="flex items-center border rounded-md p-4 bg-gray-50 has-[:checked]:border-black hover:bg-gray-100 cursor-pointer transition"
                                        >
                                            ${this.getInputComponent(choice, isSingleChoice)}
                                            <label
                                                for="${choice.$id}"
                                                class="cursor-pointer block ms-2 text-sm font-medium dark:text-gray-300"
                                            >
                                                ${choice.value}
                                            </label>
                                        </label>
                                        ${choice.additionalInput && this.isChoiceChecked(choice.$id)
                                            ? html` <pt-question
                                                  class="-mt-4 mb-2"
                                                  data-choice-id="${choice.$id}"
                                                  @input=${this.onInputChange}
                                                  .placeholder=${choice.additionalInputPlaceholder as string}
                                                  .value=${this.getChoiceData(choice.$id)[1]}
                                              ></pt-question>`
                                            : ''}
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

        const choice = this.targetChoices?.find((x) => x.$id == input.id);

        if (isSelected) {
            const limitSelectedItems = this.data?.limitSelectedItems;

            if (limitSelectedItems && this.value.data!.length == limitSelectedItems) {
                input.checked = false;
                return;
            }

            const isSingleChoice = this.data?.kind == 'single';
            if (isSingleChoice) {
                this.value.data = [];
            }
            this.value.data = [...this.value.data!, [choice!.$id, '']];

            if (isSingleChoice) {
                const selectedChoice = this.targetChoices!.find((x) => x.$id == choice!.$id);
                if (!selectedChoice?.additionalInput) {
                    this.dispatchEvent(
                        new CustomEvent(PtFormSingleChoiceSelectedEventName, { bubbles: true, composed: false })
                    );
                }
            }
        } else {
            this.value.data = this.value.data?.filter((x) => x[0] != choice!.$id);
        }

        this.requestUpdate();
    }

    onInputChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const value = input.value;
        const choiceId = (e.currentTarget as HTMLElement).dataset.choiceId!;

        this.getChoiceData(choiceId)[1] = value;
    }

    override isEmptyData() {
        return !this.value.data?.length;
    }

    override getSubmitData() {
        const submitValue = this.value
            .data!.map(([option, additionalInput]) => {
                const choice = this.targetChoices?.find((x) => x.$id == option);
                if (additionalInput) {
                    return `${choice?.value} -- ${additionalInput}`;
                } else {
                    return choice?.value;
                }
            })
            .join(',');
        return { name: this.data?.name!, value: submitValue, saveUserTag: this.data?.saveAsUserTag };
    }

    override getValidateError() {
        let baseError = super.getValidateError();

        if (baseError) {
            return baseError;
        }

        const isAnyMandatoryInputMiss = this.value.data
            ?.map((x) => x[0])
            .some((id) => {
                const choice = this.targetChoices?.find((x) => x.$id == id);
                return choice?.additionalInputRequired && !this.getChoiceData(id)[1];
            });

        if (isAnyMandatoryInputMiss) return this.mandatoryInputErrorMessage;
    }

    private isChoiceChecked(choiceId: string) {
        return this.value.data!.find((x) => x[0] == choiceId) ? true : false;
    }

    private getChoiceData(choiceId: string) {
        return this.value.data!.find((x) => x[0] == choiceId)!;
    }
}
