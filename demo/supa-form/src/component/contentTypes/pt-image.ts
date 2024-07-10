import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { PtBase } from '../pt-base';

@customElement('pt-image')
class PtImage extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['ImageElement'];

    render() {
        const align = this.data?.align || 'center';
        const maxWidth = this.data?.maxWidth || 100;
        return html`
            <div class="w-full flex" style="justify-content:${align}">
                <img
                    class="h-auto object-contain"
                    src="${this.data?.image!.url!}"
                    style="max-width:${maxWidth}%"
                    alt="image"
                />
            </div>
        `;
    }
}
