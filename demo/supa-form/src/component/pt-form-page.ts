import { LitElement, html, unsafeCSS, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import globalStyles from '../global.css?inline';

@customElement('pt-form-page')
class PtFormPage extends LitElement {
    @property()
    name?: string;

    render() {
        return html`<div class="bg-white border rounded-lg">${this.name}</div>`;
    }
    protected createRenderRoot() {
        return this;
    }

    static styles = [
        unsafeCSS(globalStyles),
        css`
            :host {
                max-width: 1280px;
                margin: 0 auto;
                padding: 2rem;
                text-align: center;
            }
        `,
    ];
}
