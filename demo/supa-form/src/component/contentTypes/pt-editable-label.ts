import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { PtBase } from '../pt-base';

@customElement('pt-editable-label')
export class PtEditableLabel extends PtBase {
    @property({ type: String, attribute: 'config-path' })
    configPath = '';

    @property({ type: String })
    label? = '';

    render() {
        return html`<span data-haya-config-path="${this.configPath}" data-haya-editable>${this.label}</span>`;
    }
}
