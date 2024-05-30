import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { app } from '../app';

@customElement('pt-form')
class PtForm extends LitElement {
    @property()
    name?: string;

    @property({
        type: Object,
        converter: {
            fromAttribute: (value: string | null) => {
                if (value === null) return undefined;
                app.loadModel(value);
                return app.model;
            },
            toAttribute: (value: typeof app.model | undefined) => {
                if (value === undefined) return null;
                return app.stringifyModel(value);
            },
        },
    })
    config?: typeof app.model;

    render() {
        return html` <div>${app.stringifyModel(this.config!)}</div> `;
    }
}
