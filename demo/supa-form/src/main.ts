import { createConceptModel } from "@gaia/configurator";
import { ChoiceQuestion, QAQuestion, TextElement } from "./config/page-items";
import { CompletePage } from "./config/page/complete-page";
import { ContentPage } from "./config/page/content-page";
import { TextChoice } from "./config/page-items/question/text-choice";
import { app } from "./config";

const model = app.createModel();
model.nextButtonText = "Next";

const contentPage1 = createConceptModel(ContentPage, {
    name: "Content Page1",
    pageItems: [
        createConceptModel(QAQuestion, {
            name: "q1.1",
            question: "Question1",
        }),
    ],
});

const contentPage2 = createConceptModel(ContentPage, {
    name: "Content Page2",
    pageItems: [
        createConceptModel(ChoiceQuestion, {
            name: "q2.1",
            question: "Question1",
            kind: "single",
            choiceKind: "text",
            textChoices: [
                createConceptModel(TextChoice, {
                    value: "Choice1",
                    defaultSelected: true,
                }),
                createConceptModel(TextChoice, {
                    value: "Choice2",
                    additionalInput: true,
                }),
            ],
        }),
    ],
});

model.contentPages.push(contentPage1);
model.contentPages.push(contentPage2);

const completePage1 = createConceptModel(CompletePage, {
    name: "Complete Page1",
    pageItems: [
        createConceptModel(TextElement, {
            kind: "h1",
            content: "Thank You!",
        }),
    ],
});

model.completePages.push(completePage1);

const configString = app.stringifyModel(model);

const ptForm = document.querySelector("#app");

if (ptForm) {
    ptForm.innerHTML = `<pt-form config='${configString}'></pt-form>`;
}
