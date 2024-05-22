import { createConceptModel } from '@/model';
import { describe } from '@jest/globals';
import { inspect } from 'util';
import { app } from './config/supa-form';
import {
    ChoiceQuestion,
    QAQuestion,
    TextElement,
} from './config/supa-form/page-items';
import { CompletePage } from './config/supa-form/page/complete-page';
import { ContentPage } from './config/supa-form/page/content-page';
import { TextChoice } from './config/supa-form/page-items/question/text-choice';

describe('supa-form sample app', () => {
    it('can create an empty model', () => {
        const model = app.createModel();

        // common fields
        expect(model.$concept).toBe('Form');
        expect(model.$type).toBe('concept');

        // default value
        expect(model.nextButtonText).toBe('下一步');

        // has-many collection initialized
        expect(model.completePages).toHaveLength(0);

        // item group initialized
        expect(model.languageSettings).toBeTruthy();

        // item without default value
        expect(model.languageSettings?.language).toBeUndefined();
    });

    it('can serialize and deserialize model', () => {
        const model = app.createModel();
        model.nextButtonText = 'Next';

        const contentPage1 = createConceptModel(ContentPage, {
            name: 'Content Page1',
            pageItems: [
                createConceptModel(QAQuestion, {
                    name: 'q1.1',
                    question: 'Question1',
                }),
            ],
        });

        const contentPage2 = createConceptModel(ContentPage, {
            name: 'Content Page2',
            pageItems: [
                createConceptModel(ChoiceQuestion, {
                    name: 'q2.1',
                    question: 'Question1',
                    kind: 'single',
                    choiceKind: 'text',
                    textChoices: [
                        createConceptModel(TextChoice, {
                            value: 'Choice1',
                            defaultSelected: true,
                        }),
                        createConceptModel(TextChoice, {
                            value: 'Choice2',
                            additionalInput: true,
                        }),
                    ],
                }),
            ],
        });

        model.contentPages.push(contentPage1);
        model.contentPages.push(contentPage2);

        const completePage1 = createConceptModel(CompletePage, {
            name: 'Complete Page1',
            pageItems: [
                createConceptModel(TextElement, {
                    kind: 'h1',
                    content: 'Thank You!',
                }),
            ],
        });

        model.completePages.push(completePage1);

        const serialized = app.stringifyModel(model);
        console.log(serialized);

        const deserialized = app.parseModel(serialized);
        console.log(inspect(deserialized, false, 10));
        expect(deserialized).toEqual(model);
    });
});
