export async function exportFormFields(publishPageUrl: string) {
    const formItemConcepts = ['ChoiceQuestion', 'QAQuestion', 'EmailQuestion'];
    const configUrl = publishPageUrl.replace('index.html', 'config.json');
    const response = await fetch(configUrl);
    const app = await response.json();

    const fields = app.model.contentPages
        .flatMap((page: any) => page.pageItems)
        .filter((item: any) => formItemConcepts.includes(item.$concept))
        .map((item: any) => item.name);

    const result = fields.join(',');

    return result;
}
