import { customElement, property } from 'lit/decorators.js';
import { PtBase } from '../pt-base';
import { BasicData } from '..';
import { unsafeStatic, html } from 'lit/static-html.js';

@customElement('pt-text')
class PtText extends PtBase {
    @property({ type: Object })
    data?: Text;

    render() {
        const tagName = this.data?.kind!;
        return html`<${unsafeStatic(tagName)}>${this.data?.content}</${unsafeStatic(tagName)}>`;
    }
}

interface Text extends BasicData {
    content: string;
    kind: string;
}
