import { NonPrimitiveTypes, createAppInstance, createRef } from '@gaia/configurator';
import { describe } from '@jest/globals';
import { inspect } from 'util';
import { config } from './app-config/form';
import { ChoiceQuestion, QAQuestion, TextElement } from './app-config/form/page-items';
import { TextChoice } from './app-config/form/page-items/question/text-choice';
import { CompletePage } from './app-config/form/page/complete-page';
import { ContentPage } from './app-config/form/page/content-page';

describe('form sample app', () => {
    it('can create an empty model', () => {
        const app = createAppInstance(config);
        const model = app.model;

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
        const app = createAppInstance(config);
        const model = app.model;
        model.nextButtonText = 'Next';

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

        model.dataCollection.drip.enable = true;
        model.dataCollection.drip.limitPagesPerDrip = {
            $type: NonPrimitiveTypes.itemGroup,
            dripCompletePage: {
                $type: 'ref',
                $concept: 'CompletePage',
                $id: completePage1.$id,
            },
            formCompletePage: {
                $type: 'ref',
                $concept: 'CompletePage',
                $id: completePage1.$id,
            },
            maxPagesPerDrip: 3,
        };

        const serialized = app.stringifyModel(model);
        console.log(serialized);

        const newApp = createAppInstance(config);
        newApp.loadModel(serialized);
        console.log(inspect(newApp.model, false, 10));
        expect(newApp.model).toEqual(model);

        const resolvedPage = newApp.resolveConcept(createRef(completePage1));
        expect(resolvedPage).toEqual(completePage1);
    });
});
