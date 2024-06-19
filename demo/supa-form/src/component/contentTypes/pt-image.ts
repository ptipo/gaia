import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AllPageItemsTypesMap } from '../../config/page-items';
import { PtBase } from '../pt-base';

@customElement('pt-image')
class PtImage extends PtBase {
    @property({ type: Object })
    data?: AllPageItemsTypesMap['ImageElement'];

    render() {
        return html`
            <div class="w-full flex justify-center">
                <img
                    class="h-auto object-contain"
                    src="${this.data?.source || this.data?.image!.url!}"
                    alt="image description"
                />
            </div>
        `;
    }
}
