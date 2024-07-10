import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { unsafeStatic, html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-text')
class PtText extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['TextElement'];

    render() {
        const isBold = this.data?.kind != 'text';
        const tagName = this.data?.kind == 'text' ? 'p' : this.data?.kind!;
        const align = this.data?.align || 'center';
        const maxWidth = this.data?.maxWidth || 100;
        return html`<div class="w-full flex" style="justify-content:${align}"> <${unsafeStatic(
            tagName
        )} style="max-width:${maxWidth}%" class="break-words ${isBold ? 'font-bold' : ''}">${
            this.data?.content
        }</${unsafeStatic(tagName)}></div>`;
    }
}
