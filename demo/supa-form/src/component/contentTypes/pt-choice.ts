import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBaseData, PtFormSingleChoiceSelectedEventName } from '../pt-base';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { when } from 'lit/directives/when.js';
import './pt-question-base';
import { consume } from '@lit/context';
import { formWidth } from '../../state';
import { localized, msg } from '@lit/localize';

type ChoiceQuestionType = AllPageItemsTypesMap['ChoiceQuestion'];

type GetArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;

@customElement('pt-choice')
export class PtChoice extends PtBaseData<Array<[string, string]>> {
    @property({ type: Object })
    data?: ChoiceQuestionType;

    @consume({ context: formWidth, subscribe: true })
    widthLevel = 2;

    override mandatoryErrorMessage = msg('Please make the selection');

    randomSeed?: number[];

    get isImageChoice() {
        return this.data?.choiceKind == 'image';
    }

    get targetChoices() {
        return this.isImageChoice ? this.data?.imageChoices : this.data?.textChoices;
    }

    imageSkeleton = html`
        <div role="status" class="pt-choice-skeleton max-w-full max-h-full h-auto w-60 animate-pulse flex items-center">
            <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg
                    class="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                >
                    <path
                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
                    />
                </svg>
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
            value="${choice.value}"
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
                  ?.map((x, i) => ({ value: x, sort: this.randomSeed![i] }))
                  .sort((a, b) => a.sort - b.sort)
                  .map((x) => x.value)
            : this.targetChoices;

        const isFlat = this.data?.flatMode as boolean;
        const description = this.data?.description;
        const isShowTextWithImage = this.data?.showTextWithImage;

        return html`
            <fieldset class="flex">
                <legend class="mb-5">
                    <span class="text-2xl font-bold">${this.data?.question}</span>
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
                                                        src="${choice.source || choice.value}"
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
                                                  data-choice-id="${choice.$id}"
                                                  @input=${this.onInputChange}
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
                this.dispatchEvent(
                    new CustomEvent(PtFormSingleChoiceSelectedEventName, { bubbles: true, composed: false })
                );
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

    isValidated() {
        return this.data?.required ? this.value.data!.length > 0 : true;
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
        return { name: this.data?.name!, value: submitValue };
    }

    private isChoiceChecked(choiceId: string) {
        return this.value.data!.find((x) => x[0] == choiceId) ? true : false;
    }

    private getChoiceData(choiceId: string) {
        return this.value.data!.find((x) => x[0] == choiceId)!;
    }
}
