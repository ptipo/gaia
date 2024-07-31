import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { PtBase } from '../pt-base';
import './pt-editable-rich-text';

@customElement('pt-text')
class PtText extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['TextElement'];

    @property({ type: String, attribute: 'config-path' })
    configPath = '';

    render() {
        const isBold = this.data?.kind != 'text';
        const tagName = this.data?.kind == 'text' ? 'p' : this.data?.kind!;
        const align = this.data?.align || 'center';
        const maxWidth = this.data?.maxWidth || 100;
        return html`<div class="w-full flex pt-text" style="justify-content:${align}"> <${unsafeStatic(
            tagName
        )} style="max-width:${maxWidth}%" class="break-words ${isBold ? 'font-bold' : ''}">        
            <pt-editable-rich-text config-path="${this.configPath + '.content'}" html="${
            this.data?.content ?? ''
        }"></pt-editable-rich-text>
        </${unsafeStatic(tagName)}></div>`;
    }
}
