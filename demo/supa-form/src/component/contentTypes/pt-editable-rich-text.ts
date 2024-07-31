import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { PtBase } from '../pt-base';

@customElement('pt-editable-rich-text')
export class PtEditableRichText extends PtBase {
    @property({ type: String, attribute: 'config-path' })
    configPath = '';

    @property({ type: String })
    html? = '';

    render() {
        return html`<span data-haya-config-path="${this.configPath}" data-haya-rte>${unsafeHTML(this.html)}</span>`;
    }
}
