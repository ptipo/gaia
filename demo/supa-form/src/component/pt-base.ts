import { LitElement, unsafeCSS } from 'lit';
import globalStyles from './form.css?inline';
import { consume } from '@lit/context';
import { formState, FormAnswerData } from '../state';
import { property } from 'lit/decorators.js';

export const PtFormStateChangeEventName = 'pt-form-state-changed';
export const PtFormSingleChoiceSelectedEventName = 'pt-form-single-choice-selected';
export const PtFormNextPageEventName = 'pt-form-next-page';

type Constructor<T = {}> = new (...args: any[]) => T;

const BaseMixin = <T extends Constructor<LitElement>>(superClass: T, isShadowDom: boolean) => {
    class PtBase extends superClass {
        // Adds tailwind global styles to the component
        static styles = [(superClass as unknown as typeof LitElement).styles ?? [], unsafeCSS(globalStyles)];

        protected createRenderRoot() {
            return isShadowDom ? super.createRenderRoot() : this;
        }
    }

    return PtBase as T;
};

abstract class DataBase<T> extends BaseMixin(LitElement, false) {
    @property({ type: Object })
    data?: { $id: string; required: boolean };

    @property({ type: Object })
    value: QuestionState<T> = new QuestionState<T>();

    @property({ type: Boolean })
    showValidationError = false;

    connectedCallback() {
        super.connectedCallback();
        if (this.formState.answers[this.data!.$id]) {
            this.value = this.formState.answers[this.data!.$id];
        }
    }

    abstract isValidated(): boolean;

    abstract mandatoryErrorMessage: string;

    abstract getSubmitData(): FormSubmitData;

    getValidateError() {
        if (this.data?.required && this.isEmptyData()) {
            return this.mandatoryErrorMessage;
        }
    }

    isEmptyData() {
        return !this.value.data;
    }

    updated() {
        const questionData = (this.formState.answers[this.data!.$id] = this.value);
        questionData.submitData = this.getSubmitData();
        this.dispatchUpdate();
    }

    dispatchUpdate() {
        this.dispatchEvent(
            new CustomEvent(PtFormStateChangeEventName, { bubbles: true, composed: false, detail: this.value })
        );
    }

    @consume({ context: formState })
    formState: FormAnswerData = { answers: {} };
}

export interface FormSubmitData {
    name: string;
    value: string;
    saveUserTag?: Array<string>;
}

export class QuestionState<T> {
    data?: T;
    submitData?: FormSubmitData;
}

export const PtBase = BaseMixin(LitElement, false);

export const PtBaseShadow = BaseMixin(LitElement, true);

export const PtBaseData = DataBase;
