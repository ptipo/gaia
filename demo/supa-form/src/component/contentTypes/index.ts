import './pt-choice';
import './pt-qa';
import './pt-text';
import './pt-email';
import './pt-image';

const contentTypeComponentDict: { [key: string]: string } = {
    QAQuestion: 'pt-qa',
    ChoiceQuestion: 'pt-choice',
    TextElement: 'pt-text',
    EmailQuestion: 'pt-email',
    ImageElement: 'pt-image',
};

export function getContentTypeComponent(conceptName: string) {
    return contentTypeComponentDict[conceptName];
}
