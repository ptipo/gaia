import {
    NonPrimitiveTypes,
    cloneConceptModel,
    createAppInstance,
    createRef,
    inferConcept,
} from '@hayadev/configurator';
import { describe } from '@jest/globals';
import { inspect } from 'util';
import { FormApp as config } from './app-config/form';
import { ChoiceQuestion, QAQuestion, TextElement } from './app-config/form/page-items';
import { TextChoice } from './app-config/form/page-items/question/text-choice';
import { CompletePage } from './app-config/form/page/complete-page';
import { ContentPage } from './app-config/form/page/content-page';

describe('form sample app', () => {
    it('can create an empty model', () => {
        const app = createAppInstance(config, '1.0.1');
        const model = app.model;

        // common fields
        expect(model.$concept).toBe('Form');
        expect(model.$type).toBe('concept');

        // has-many collection initialized
        expect(model.completePages).toHaveLength(0);

        // item group initialized
        expect(model.languageSettings).toBeTruthy();

        // item without default value
        expect(model.languageSettings?.language).toBeUndefined();
    });

    it('can serialize and deserialize model', () => {
        const app = createAppInstance(config, '1.0.1');
        const model = app.model;

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

        const newApp = createAppInstance(config, '1.0.1');

        const loaded = newApp.loadModel(serialized);
        expect(loaded.model).toBeTruthy();
        expect(loaded.appVersion).toBe('1.0.1');

        console.log(inspect(newApp.model, false, 10));
        expect(newApp.model).toEqual(model);

        const resolvedPage = newApp.resolveConcept(createRef(completePage1));
        expect(resolvedPage).toEqual(completePage1);
    });

    it('can clone a concept model', () => {
        const app = createAppInstance(config, '1.0.1');

        const contentPage1 = app.createConceptInstance(ContentPage, {
            name: 'Content Page1',
            pageItems: [
                app.createConceptInstance(ChoiceQuestion, {
                    name: 'q1',
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

        const cloned = cloneConceptModel(contentPage1);

        expect(cloned.name).toBe(contentPage1.name);
        expect(cloned.$id).not.toBe(contentPage1.$id);

        expect(cloned.pageItems[0].name).toBe(contentPage1.pageItems[0].name);
        expect(cloned.pageItems[0].$id).not.toBe(contentPage1.pageItems[0].$id);

        expect((cloned.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![0].name).toBe(
            (contentPage1.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![0].name
        );
        expect((cloned.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![0].$id).not.toBe(
            (contentPage1.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![0].$id
        );

        expect((cloned.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![1].name).toBe(
            (contentPage1.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![1].name
        );
        expect((cloned.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![1].$id).not.toBe(
            (contentPage1.pageItems[0] as inferConcept<typeof ChoiceQuestion>).textChoices![1].$id
        );
    });
});
