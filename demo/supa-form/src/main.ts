import { app } from './app';
import { ChoiceQuestion, QAQuestion, TextElement } from './config/page-items';
import { TextChoice } from './config/page-items/question/text-choice';
import { CompletePage } from './config/page/complete-page';
import { ContentPage } from './config/page/content-page';

const model = app.createConceptInstance(app.concept);

const contentPage1 = app.createConceptInstance(ContentPage, {
    name: 'Content Page1',
    pageItems: [
        app.createConceptInstance(QAQuestion, {
            name: 'q1.1',
            question: 'Question1',
        }),
    ],
});

const contentPage2 = app.createConceptInstance(ContentPage, {
    name: 'Content Page2',
    pageItems: [
        app.createConceptInstance(ChoiceQuestion, {
            name: 'q2.1',
            question: 'Question1',
            kind: 'single',
            choiceKind: 'text',
            textChoices: [
                app.createConceptInstance(TextChoice, {
                    value: 'Choice1',
                    defaultSelected: true,
                }),
                app.createConceptInstance(TextChoice, {
                    value: 'Choice2',
                    additionalInput: true,
                }),
            ],
        }),
    ],
});

model.contentPages.push(contentPage1);
model.contentPages.push(contentPage2);

const completePage1 = app.createConceptInstance(CompletePage, {
    name: 'Complete Page1',
    pageItems: [
        app.createConceptInstance(TextElement, {
            kind: 'h1',
            content: 'Thank You!',
        }),
    ],
});

model.completePages.push(completePage1);

const configString = JSON.stringify({ appVersion: app.version, model });

const ptForm = document.querySelector('#app');

if (ptForm) {
    ptForm.innerHTML = `<pt-form config='${configString}'></pt-form>`;
}
