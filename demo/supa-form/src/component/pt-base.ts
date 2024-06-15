import { LitElement, css, html, unsafeCSS } from 'lit';
import globalStyles from '../global.css?inline';
import { consume } from '@lit/context';
import { formState, answerData } from '../state';
import { property } from 'lit/decorators.js';

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
        if (this.formState[this.data!.$id]) {
            this.value = this.formState[this.data!.$id];
        }
    }

    abstract isValidated(): boolean;

    abstract mandatoryErrorMessage: string;

    getValidateError() {
        if (this.data?.required && this.isEmptyData()) {
            return this.mandatoryErrorMessage;
        }
    }

    isEmptyData() {
        return !this.value.data;
    }

    updated() {
        this.formState[this.data!.$id] = this.value;

        const isValid = this.isValidated();

        this.value.isValid = isValid;
        this.dispatchUpdate();
    }

    dispatchUpdate() {
        this.dispatchEvent(new CustomEvent('pt-form-state-changed', { bubbles: true, composed: false }));
    }

    @consume({ context: formState })
    formState: answerData = {};
}

export class QuestionState<T> {
    data?: T;
    isValid: boolean;

    constructor(data?: T, isValid = true) {
        this.data = data;
        this.isValid = isValid;
    }
}

export const PtBase = BaseMixin(LitElement, false);

export const PtBaseShadow = BaseMixin(LitElement, true);

export const PtBaseData = DataBase;
