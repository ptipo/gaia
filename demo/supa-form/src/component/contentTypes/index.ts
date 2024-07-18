import './pt-choice';
import './pt-qa';
import './pt-text';
import './pt-email';
import './pt-image';
import './pt-copy-to-clipboard';
import './pt-text-check';

const contentTypeComponentDict: { [key: string]: string } = {
    QAQuestion: 'pt-qa',
    ChoiceQuestion: 'pt-choice',
    TextElement: 'pt-text',
    EmailQuestion: 'pt-email',
    ImageElement: 'pt-image',
    CopyToClipboard: 'pt-copy-to-clipboard',
    TextCheckElement: 'pt-text-check',
};

export function getContentTypeComponent(conceptName: string) {
    return contentTypeComponentDict[conceptName];
}
