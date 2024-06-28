import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { unsafeStatic, html } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';

@customElement('pt-text')
class PtText extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['TextElement'];

    render() {
        const tagName = this.data?.kind || 'p';
        const align = this.data?.align || 'center';
        const maxWidth = this.data?.maxWidth || 100;
        return html`<div class="w-full flex" style="justify-content:${align}"> <${unsafeStatic(
            tagName
        )} style="max-width:${maxWidth}%" class="break-words">${this.data?.content}</${unsafeStatic(tagName)}></div>`;
    }
}
