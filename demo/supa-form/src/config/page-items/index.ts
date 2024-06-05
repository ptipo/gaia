import { inferConcept } from '@gaia/configurator';
import { CopyToClipboard } from './element/copy-to-clipboard-element';
import { ImageElement } from './element/image-element';
import { TextElement } from './element/text-element';
import { ChoiceQuestion } from './question/choice-question';
import { EmailQuestion } from './question/email-question';
import { QAQuestion } from './question/qa-question';

/**
 * 所有页面内容项，包含问题和元素
 */

const allPageItemMap = {
    QAQuestion,
    ChoiceQuestion,
    EmailQuestion,
    ImageElement,
    TextElement,
    CopyToClipboard,
};

export const AllPageItems = Object.values(allPageItemMap);

export {
    ChoiceQuestion,
    CopyToClipboard,
    EmailQuestion,
    ImageElement,
    QAQuestion,
    TextElement,
};

export type AllPageItemsTypesMap = {
    [K in keyof typeof allPageItemMap]: inferConcept<
        (typeof allPageItemMap)[K]
    >;
};
