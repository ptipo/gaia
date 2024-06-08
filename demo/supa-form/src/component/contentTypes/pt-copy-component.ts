import { customElement, property } from 'lit/decorators.js';
import { LitElement, css, html } from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

@customElement('pt-copy-component')
export class PtCopyComponent extends LitElement {
    @property({ type: Boolean })
    copied = false;

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.handleCopy);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this.handleCopy);
    }

    static styles = css`
        :host {
            display: block;
        }
    `;

    render() {
        return html`
            <slot></slot>
            <slot name="button"></slot>
        `;
    }

    private async handleCopy(e: Event) {
        if (
            e &&
            !e
                .composedPath()
                .some((maybeButton) =>
                    maybeButton instanceof HTMLElement ? maybeButton.getAttribute('slot') === 'button' : false
                )
        ) {
            // not clicked button
            return;
        }
        const slottedElements = (
            this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement
        ).assignedElements({ flatten: true });
        if (slottedElements && slottedElements.length) {
            try {
                await this.copyText(slottedElements[0] as HTMLElement);
                this.copied = true;
                this.dispatchEvent(new CustomEvent('copy', { bubbles: true, composed: true }));
            } catch (e) {
                this.dispatchEvent(new CustomEvent('copy-failed', { bubbles: true, composed: true }));
            }
        } else {
            console.error('No slotted elements found to copy.');
        }
    }

    private async copyText(element: HTMLElement) {
        if ('clipboard' in navigator) {
            try {
                await navigator.clipboard.writeText(element.innerText);
            } catch (err) {
                throw new Error('copy failed');
            }
        } else {
            let currentRange;
            let selection;
            try {
                document.execCommand('copy');
                selection = window.getSelection()!;
                currentRange = selection.rangeCount === 0 ? null : selection.getRangeAt(0);
                const range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (err) {
                throw new Error('copy failed');
            } finally {
                selection?.removeAllRanges();
                currentRange && selection?.addRange(currentRange);
            }
        }
    }
}
