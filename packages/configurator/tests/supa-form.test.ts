import {
    NonPrimitiveTypes,
    cloneConceptModel,
    createAppInstance,
    createRef,
    inferConcept,
} from '@hayadev/configurator';
import { describe } from '@jest/globals';
import { FormApp as config } from './app-config/form';
import { ChoiceQuestion, QAQuestion, TextElement } from './app-config/form/page-items';
import { TextChoice } from './app-config/form/page-items/question/text-choice';
import { CompletePage } from './app-config/form/page/complete-page';
import { ContentPage } from './app-config/form/page/content-page';

describe('form sample app', () => {
    it('can create an empty model', () => {
        const app = createAppInstance(config, '1.0.1');
        const model = app.createConceptInstance(app.concept);

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

    it('can resolve concept', () => {
        const app = createAppInstance(config, '1.0.1');
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

        const resolvedPage = app.resolveConcept(model, createRef(completePage1));
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

    it('can auto fix has-many candidate issues', () => {
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

        const completePage1 = app.createConceptInstance(CompletePage, {
            name: 'Complete Page1',
            pageItems: [
                app.createConceptInstance(TextElement, {
                    kind: 'h1',
                    content: 'Thank You!',
                }),
            ],
        });

        const model = app.createConceptInstance(app.concept);
        model.contentPages.push(contentPage1);
        model.contentPages.push(completePage1 as any);

        const validateResult = app.validateModel(model);
        expect(validateResult.success).toBe(false);
        if (!validateResult.success) {
            expect(validateResult.issues[0].message).toContain(
                `Concept "CompletePage" is not a candidate of this has-many item`
            );
        }

        const importResult = app.importModel(model);
        console.log(importResult);
        expect(importResult.success).toBeTruthy();
        if (importResult.success) {
            expect(importResult.model.contentPages).toHaveLength(1);
            expect(importResult.model.completePages).toHaveLength(0);
        }
    });
});
