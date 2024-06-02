import { LitElement, css, unsafeCSS } from 'lit';
import globalStyles from '../global.css?inline';
import { consume } from '@lit/context';
import { formState, stateData } from '../state';
import { property } from 'lit/decorators.js';
import { BasicData } from '.';

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

class DataBase extends LitElement {
    @property({ type: Object })
    data?: BasicData;

    @property()
    value?: any;

    connectedCallback() {
        super.connectedCallback();
        this.value = this.formState[this.data!.$id] || '';
    }

    updated() {
        this.formState[this.data!.$id] = this.value;
    }

    @consume({ context: formState })
    formState: stateData = {};
}

export const PtBase = BaseMixin(LitElement, false);

export const PtBaseShadow = BaseMixin(LitElement, true);

export const PtBaseData = BaseMixin(DataBase, false);
