import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { unsafeStatic, html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-text')
class PtText extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['TextElement'];

    render() {
        const tagName = this.data?.kind!;
        return html`<${unsafeStatic(tagName)}>${this.data?.content}</${unsafeStatic(tagName)}>`;
    }
}
