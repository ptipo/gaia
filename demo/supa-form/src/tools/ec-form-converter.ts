import { createAppInstance } from '@hayadev/configurator';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { version as appVersion } from '../../package.json';
import { config as FormApp } from '../config';
import { ChoiceQuestion, EmailQuestion, QAQuestion, TextElement } from '../config/page-items';
import { ImageChoice } from '../config/page-items/question/image-choice';
import { TextChoice } from '../config/page-items/question/text-choice';
import { CompletePage } from '../config/page/complete-page';
import { ContentPage } from '../config/page/content-page';

// form app
const app = createAppInstance(FormApp, appVersion);

interface ECFormPage {
    id: string;
    title: string;
    required?: boolean;
    type?: string;
    options?: ECOption[];
}

interface ECOption {
    label: string;
    value: string;
    imageSrc?: string;
}

function convertContentPage(ecPage: ECFormPage) {
    let pageItem;

    if (ecPage.type === 'choice') {
        const test = ecPage.options!.map((option: ECOption) =>
            app.createConceptInstance(TextChoice, {
                value: option.value,
            })
        );

        pageItem = app.createConceptInstance(ChoiceQuestion, {
            name: ecPage.title,
            question: ecPage.title,
            choiceKind: 'text',
            textChoices: ecPage.options!.map((option: ECOption) =>
                app.createConceptInstance(TextChoice, {
                    value: option.value,
                })
            ),
        });
    } else if (ecPage.type === 'picture-choice') {
        pageItem = app.createConceptInstance(ChoiceQuestion, {
            name: ecPage.title,
            question: ecPage.title,
            choiceKind: 'image',
            flatMode: true,
            imageChoices: ecPage.options!.map((option: ECOption) =>
                app.createConceptInstance(ImageChoice, {
                    name: option.value,
                    source: option.imageSrc,
                })
            ),
        });
    } else if (ecPage.type === 'email') {
        pageItem = app.createConceptInstance(EmailQuestion, {
            name: ecPage.title,
            question: ecPage.title,
        });
    } else {
        pageItem = app.createConceptInstance(QAQuestion, {
            name: ecPage.title,
            question: ecPage.title,
        });
    }

    return app.createConceptInstance(ContentPage, {
        name: ecPage.id,
        pageItems: [pageItem],
    });
}

function convertCompletePage(ecPage: ECFormPage) {
    const pageItem = app.createConceptInstance(TextElement, {
        kind: 'h1',
        content: ecPage.title,
    });

    return app.createConceptInstance(CompletePage, {
        name: ecPage.id,
        title: ecPage.title,
        pageItems: [pageItem],
    });
}

export function convertECForm(ecForm: ECFormPage[]) {
    const model = app.createConceptInstance(app.concept);
    const contentPages = ecForm.filter((page) => page.type).map(convertContentPage);

    model.contentPages.push(...contentPages);

    const completePages = ecForm.filter((page) => !page.type).map(convertCompletePage);

    model.completePages.push(...completePages);

    return model;
}

const program = new Command();

program
    .option('-i, --input <input>', 'ECForm config JSON file path', 'ec-form.json')
    .option('-o, --output <output>', 'Output PtForm config file path', 'pt-form.json')
    .action((options: any) => {
        const inputPath = path.resolve(process.cwd(), options.input);
        console.log('input file', inputPath);
        const ecConfigFile = fs.readFileSync(options.input, 'utf8');
        const ecConfig = JSON.parse(ecConfigFile);

        const model = convertECForm(ecConfig);

        const ptConfig = JSON.stringify({ appVersion: app.version, model });

        fs.writeFileSync(options.output, ptConfig);

        console.log(`output file ${path.resolve(process.cwd(), options.output)}`);
    });

program.parse(process.argv);
