import './pt-choice';
import './pt-qa';
import './pt-text';

const contentTypeComponentDict: { [key: string]: string } = {
    QAQuestion: 'pt-qa',
    ChoiceQuestion: 'pt-choice',
    TextElement: 'pt-text',
};

export function getContentTypeComponent(conceptName: string) {
    return contentTypeComponentDict[conceptName];
}
