import { BaseConceptModel } from '@hayadev/configurator';
import deepcopy from 'deepcopy';
// import RichTextEditor from './components/RichTextEditor.vue';
// import { createVNode } from 'vue';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from '@/lib/tiptap/underline';
import Bold from '@tiptap/extension-bold';
import Color from '@tiptap/extension-color';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import TextStyle from '@tiptap/extension-text-style';
import BubbleMenu from '@tiptap/extension-bubble-menu';

function findEditableElement(event: Event) {
    if (!event.target) {
        return undefined;
    }

    // traverse the event path (wrapped inside `composedPath` for shadow DOM) to
    // find an editable element
    for (const el of event.composedPath()) {
        if (!(el instanceof HTMLElement)) {
            continue;
        }

        if (
            el.getAttribute('data-haya-config-path') &&
            (el.hasAttribute('data-haya-editable') || el.hasAttribute('data-haya-rte'))
        ) {
            return el;
        }
    }

    return undefined;
}

function exitEdit(
    el: HTMLElement,
    model: BaseConceptModel,
    updateModel: (model: BaseConceptModel) => void,
    rte: Editor | undefined
) {
    const configPath = el.getAttribute('data-haya-config-path');
    if (!configPath) {
        console.warn('No config path found for the editable element');
        rte?.destroy();
        return;
    }

    // path: x.y[0].z
    const parts = configPath.split(/[.\[\]]/).filter((part) => !!part);

    // clone the model
    const newModel = deepcopy(model);

    // traverse the model and update the value
    let current: any = newModel;
    for (let i = 0; i < parts.length; i++) {
        if (!current || (typeof current !== 'object' && !Array.isArray(current))) {
            break;
        }

        const part = parts[i];
        if (i === parts.length - 1) {
            if (Array.isArray(current)) {
                current[parseInt(part)] = el.innerText;
            } else {
                current[part] = rte?.getHTML() ?? el.innerText;
            }
        } else {
            if (Array.isArray(current)) {
                current = current[parseInt(part)];
            } else {
                current = current[part];
            }
        }
    }

    // call back
    updateModel(newModel);

    // quit edit mode
    if (rte) {
        rte.destroy();
        showChildren(el);
    } else {
        el.contentEditable = 'false';
    }
}

/**
 * Installs inline edit event handlers on the app element.
 * @param appEl the element
 * @param getModel callback to get the current model
 * @param updateModel callback to handle an updated new model
 */
export function addInlineEditEventHandlers(
    appEl: HTMLElement,
    getModel: () => BaseConceptModel,
    updateModel: (model: BaseConceptModel) => void,
    onOpenColorPicker: () => void
) {
    // let rteHost: HTMLElement | null = null;
    let rte: Editor | undefined;

    appEl.addEventListener(
        'click',
        (event: MouseEvent) => {
            if (rte) {
                return;
            }

            const el = findEditableElement(event);
            if (!el) {
                return;
            }

            // enter edit
            if (isRTE(el)) {
                const html = el.innerHTML;
                hideChildren(el);

                const { menuEl, boldBtn, underlineBtn, colorBtn } = createBubbleMenu();

                rte = new Editor({
                    element: el,
                    extensions: [
                        Document,
                        Paragraph,
                        Text,
                        TextStyle,
                        Underline,
                        Strike,
                        Bold,
                        Italic,
                        Color,
                        Link.configure({ openOnClick: false }),
                        BubbleMenu.configure({ element: menuEl }),
                    ],
                    autofocus: true,
                    injectCSS: false,
                    content: html,
                });

                boldBtn.addEventListener('click', () => rte?.chain().focus().toggleBold().run());
                underlineBtn.addEventListener('click', () => rte?.chain().focus().toggleUnderline().run());
                colorBtn.addEventListener('click', () => onOpenColorPicker());
            } else {
                el.contentEditable = 'true';
                el.focus();
            }
            event.stopPropagation();
            event.preventDefault();
        },
        { capture: true }
    );

    appEl.addEventListener('blur', (event: FocusEvent) => {
        const el = findEditableElement(event);
        if (
            el &&
            // make sure we're in edit mode
            (rte || el.contentEditable === 'true')
        ) {
            exitEdit(el, getModel(), updateModel, rte);
            rte = undefined;
        }
    });

    appEl.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== 'Escape') {
                return;
            }

            if (event.key === 'Enter' && rte) {
                // let the editor handle the enter key
                return;
            }

            const el = findEditableElement(event);
            if (
                el &&
                // make sure we're in edit mode
                (rte || el.contentEditable === 'true')
            ) {
                event.stopPropagation();
                event.preventDefault();
                exitEdit(el, getModel(), updateModel, rte);
                rte = undefined;
            }
        },
        { capture: true }
    );
}

function isRTE(el: HTMLElement) {
    return el.hasAttribute('data-haya-rte');
}

function hideChildren(el: HTMLElement) {
    Array.from(el.children).forEach((child) => {
        (child as HTMLElement).style.display = 'none';
    });
}

function showChildren(el: HTMLElement) {
    Array.from(el.children).forEach((child) => {
        (child as HTMLElement).style.display = '';
    });
}

function createBubbleMenu() {
    const menuEl = document.createElement('div');
    // menuEl.classList.add('flex', 'gap-1', 'border', 'px-2', 'py-1', 'text-xs', 'bg-white', 'rounded');

    menuEl.style.display = 'flex';
    menuEl.style.gap = '0.5em';
    menuEl.style.backgroundColor = 'white';
    menuEl.style.border = '1px solid #ccc';
    menuEl.style.borderRadius = '0.25em';
    menuEl.style.fontSize = '0.75em';
    menuEl.style.padding = '6px 12px';
    menuEl.style.fontFamily = 'sans-serif';
    menuEl.style.fontWeight = 'normal';
    menuEl.style.lineHeight = '1';

    const boldBtn = document.createElement('button');
    boldBtn.innerHTML = '<span style="font-weight: bold;">B</span>';
    menuEl.appendChild(boldBtn);

    const underlineBtn = document.createElement('button');
    underlineBtn.innerHTML = '<span style="text-decoration: underline;">U</span>';
    menuEl.appendChild(underlineBtn);

    const colorBtn = document.createElement('button');
    colorBtn.innerHTML = '<span style="">C</span>';
    menuEl.appendChild(colorBtn);

    return { menuEl, boldBtn, underlineBtn, colorBtn };
}
