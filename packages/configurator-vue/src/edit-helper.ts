import ColorPickerIcon from '@/assets/icon/color-picker.svg?raw';
import Underline from '@/lib/tiptap/underline';
import { BaseConceptModel } from '@hayadev/configurator';
import { Editor } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import deepcopy from 'deepcopy';

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

const ActiveBtnBackground = '#eef5fe';

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
    onOpenColorPicker: (onColorChange: (color: string | null) => void) => void
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
                rte = handleRteEdit(el, rte, onOpenColorPicker);
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

function handleRteEdit(
    el: HTMLElement,
    rte: Editor | undefined,
    onOpenColorPicker: (onColorChange: (color: string | null) => void) => void
) {
    const html = el.innerHTML;
    hideChildren(el);

    const { menuEl, boldBtn, underlineBtn, italicBtn, strikeThroughBtn, colorBtn } = createBubbleMenu();

    const updateBtnState = (editor: Editor) => {
        const textStyle = editor.isActive('textStyle') ? editor.getAttributes('textStyle') : {};

        if (editor.isActive('bold')) {
            boldBtn.style.backgroundColor = ActiveBtnBackground;
        } else {
            boldBtn.style.backgroundColor = '';
        }

        if (textStyle.underline) {
            underlineBtn.style.backgroundColor = ActiveBtnBackground;
        } else {
            underlineBtn.style.backgroundColor = '';
        }

        if (editor.isActive('italic')) {
            italicBtn.style.backgroundColor = ActiveBtnBackground;
        } else {
            italicBtn.style.backgroundColor = '';
        }

        if (editor.isActive('strike')) {
            strikeThroughBtn.style.backgroundColor = ActiveBtnBackground;
        } else {
            strikeThroughBtn.style.backgroundColor = '';
        }

        if (textStyle.color) {
            colorBtn.style.backgroundColor = textStyle.color;
        } else {
            colorBtn.style.backgroundColor = '';
        }
    };

    boldBtn.addEventListener('click', () => rte?.chain().focus().toggleBold().run());
    underlineBtn.addEventListener('click', () => rte?.chain().focus().toggleUnderline().run());
    italicBtn.addEventListener('click', () => rte?.chain().focus().toggleItalic().run());
    strikeThroughBtn.addEventListener('click', () => rte?.chain().focus().toggleStrike().run());
    colorBtn.addEventListener('click', () => {
        onOpenColorPicker((color) => {
            if (color) {
                rte?.chain().focus().setColor(color).run();
            } else {
                rte?.chain().focus().unsetColor().run();
            }
        });
    });

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
        onSelectionUpdate: ({ editor }) => updateBtnState(editor),
        onUpdate: ({ editor }) => updateBtnState(editor),
    });

    return rte;
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
    // menuEl.style.gap = '0.25em';
    menuEl.style.backgroundColor = 'white';
    menuEl.style.border = '1px solid #ccc';
    menuEl.style.borderRadius = '0.25em';
    menuEl.style.fontSize = '0.75em';
    menuEl.style.padding = '4px 4px';
    menuEl.style.fontFamily = 'sans-serif';
    menuEl.style.fontWeight = 'normal';
    menuEl.style.lineHeight = '1';

    const buttons: HTMLButtonElement[] = [];

    const boldBtn = document.createElement('button');
    buttons.push(boldBtn);
    boldBtn.innerHTML = '<span style="font-weight: bold;">B</span>';
    menuEl.appendChild(boldBtn);

    const underlineBtn = document.createElement('button');
    buttons.push(underlineBtn);
    underlineBtn.innerHTML = '<span style="text-decoration: underline;">U</span>';
    menuEl.appendChild(underlineBtn);

    const italicBtn = document.createElement('button');
    buttons.push(italicBtn);
    italicBtn.innerHTML = '<span style="font-style: italic;">I</span>';
    menuEl.appendChild(italicBtn);

    const strikeThroughBtn = document.createElement('button');
    buttons.push(strikeThroughBtn);
    strikeThroughBtn.innerHTML = '<span style="text-decoration: line-through;">S</span>';
    menuEl.appendChild(strikeThroughBtn);

    const colorBtn = document.createElement('button');
    buttons.push(colorBtn);
    colorBtn.innerHTML = ColorPickerIcon;
    menuEl.appendChild(colorBtn);

    for (const btn of buttons) {
        btn.style.padding = '0.5em';
        btn.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);';
    }

    return { menuEl, boldBtn, underlineBtn, italicBtn, strikeThroughBtn, colorBtn };
}
