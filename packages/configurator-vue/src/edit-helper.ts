import { BaseConceptModel } from '@hayadev/configurator';
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

        if (el.getAttribute('data-haya-config-path') && el.hasAttribute('data-haya-editable')) {
            return el;
        }
    }

    return undefined;
}

function exitEdit(el: HTMLElement, model: BaseConceptModel, updateModel: (model: BaseConceptModel) => void) {
    if (el.contentEditable === 'true') {
        el.contentEditable = 'false';
    } else {
        return;
    }

    const configPath = el.getAttribute('data-haya-config-path');
    if (!configPath) {
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
                current[part] = el.innerText;
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
    updateModel: (model: BaseConceptModel) => void
) {
    appEl.addEventListener(
        'click',
        (event: MouseEvent) => {
            const el = findEditableElement(event);
            if (!el) {
                return;
            }

            // enter edit
            el.contentEditable = 'true';
            el.focus();
            event.stopPropagation();
            event.preventDefault();
        },
        { capture: true }
    );

    appEl.addEventListener('blur', (event: FocusEvent) => {
        const el = findEditableElement(event);
        if (el) {
            exitEdit(el, getModel(), updateModel);
        }
    });

    appEl.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key !== 'Enter') {
            return;
        }
        const el = findEditableElement(event);
        if (el) {
            exitEdit(el, getModel(), updateModel);
        }
    });
}
