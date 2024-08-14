import { beforeEach, describe, expect, it, vi } from 'vitest';

import '../src/component/pt-form.js';

describe('Basic test', async () => {
    let shadowRoot: ShadowRoot;

    async function sleep(ms = 100) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    beforeEach(() => {
        const config = {
            model: {
                $id: '5a74dcfd-2bf5-4e28-96be-a8a5b86ad7f8',
                $type: 'concept',
                $concept: 'Form',
                contentPages: [
                    {
                        $id: 'd044eff5-ddbf-4ec6-855a-f9fddd7e746a',
                        $type: 'concept',
                        $concept: 'ContentPage',
                        name: '表单页1',
                        pageItems: [
                            {
                                $id: 'efa159c8-f4fa-45cd-b23a-3940031a26c0',
                                $type: 'concept',
                                $concept: 'ChoiceQuestion',
                                name: '选择1',
                                question: '选择1',
                                required: false,
                                kind: 'single',
                                choiceKind: 'text',
                                textChoices: [
                                    {
                                        $id: 'b86d376c-365c-4165-a52e-c64d72ad512e',
                                        $type: 'concept',
                                        $concept: 'TextChoice',
                                        value: 'A',
                                        additionalInput: false,
                                    },
                                    {
                                        $id: '2d4bed5d-675a-46b4-8b3a-cc8edb2be687',
                                        $type: 'concept',
                                        $concept: 'TextChoice',
                                        value: 'B',
                                    },
                                    {
                                        $id: '33458a56-0a2d-4a36-8d4a-c90e7282b4a1',
                                        $type: 'concept',
                                        $concept: 'TextChoice',
                                        value: 'C',
                                    },
                                    {
                                        $id: '692b656c-0392-4385-b54e-652d12475bb8',
                                        $type: 'concept',
                                        $concept: 'TextChoice',
                                        value: 'D',
                                    },
                                ],
                            },
                        ],
                        nextButton: {
                            $id: 'fbc1e5a2-d81c-4ce9-8680-7294164f76ea',
                            $type: 'concept',
                            $concept: 'NextButton',
                            action: 'next',
                        },
                    },
                    {
                        $id: 'c5783936-ade8-4767-94e0-059d8b5727ff',
                        $type: 'concept',
                        $concept: 'ContentPage',
                        name: '表单页2',
                        pageItems: [
                            {
                                $id: '62332805-dc8e-49d4-a804-e303d943d06f',
                                $type: 'concept',
                                $concept: 'ChoiceQuestion',
                                name: '选择2',
                                question: '选择2',
                                required: false,
                                kind: 'multiple',
                                choiceKind: 'image',
                                showTextWithImage: true,
                                imageChoices: [
                                    {
                                        $id: '854f8337-5b32-4c25-800f-fd792a64ecf1',
                                        $type: 'concept',
                                        $concept: 'ImageChoice',
                                        name: 'A',
                                        value: {
                                            $type: 'image',
                                            url: 'https://comp.ptengine.com/res/placeholder-md.svg',
                                        },
                                    },
                                    {
                                        $id: 'a060c8b3-32be-4dd3-869d-be5c392d66e0',
                                        $type: 'concept',
                                        $concept: 'ImageChoice',
                                        name: 'B',
                                        value: {
                                            $type: 'image',
                                            url: 'https://comp.ptengine.com/res/placeholder-md.svg',
                                        },
                                    },
                                    {
                                        $id: '4cd2327f-3a76-406f-b958-1938c3ac3db7',
                                        $type: 'concept',
                                        $concept: 'ImageChoice',
                                        name: 'C',
                                        value: {
                                            $type: 'image',
                                            url: 'https://comp.ptengine.com/res/placeholder-md.svg',
                                        },
                                    },
                                    {
                                        $id: 'c732a6dd-ed9a-4310-b803-5deb77c045df',
                                        $type: 'concept',
                                        $concept: 'ImageChoice',
                                        name: 'D',
                                        value: {
                                            $type: 'image',
                                            url: 'https://comp.ptengine.com/res/placeholder-md.svg',
                                        },
                                    },
                                ],
                                flatMode: true,
                            },
                        ],
                        nextButton: {
                            $id: '698b1f83-fe91-4c9a-b6e6-c0da231746f3',
                            $type: 'concept',
                            $concept: 'NextButton',
                            action: 'next',
                        },
                    },
                    {
                        $id: 'b245e9b0-d4c7-4292-b8f6-d3df5d9733c9',
                        $type: 'concept',
                        $concept: 'ContentPage',
                        name: '表单页3',
                        pageItems: [
                            {
                                $id: '2d352b6b-eff6-493f-9e4e-9787dddd1b64',
                                $type: 'concept',
                                $concept: 'QAQuestion',
                                name: '问答1',
                                question: '问答1',
                                required: false,
                            },
                        ],
                        nextButton: {
                            $id: '27fdb456-4a54-4fe0-b9e4-b212eb6d3c0a',
                            $type: 'concept',
                            $concept: 'NextButton',
                            action: 'next',
                        },
                    },
                ],
                completePages: [
                    {
                        $id: 'e9d7e643-47fc-48da-bd00-cb029b0a63cb',
                        $type: 'concept',
                        $concept: 'CompletePage',
                        name: '结束页1',
                        pageItems: [
                            {
                                $id: 'c46ed42f-56b0-475d-85a6-798c67be8f51',
                                $type: 'concept',
                                $concept: 'TextElement',
                                kind: 'text',
                                content: '<p>Thanks</p>',
                                align: 'center',
                                maxWidth: 100,
                            },
                        ],
                    },
                ],
                languageSettings: {
                    $type: 'item-group',
                },
                dataCollection: {
                    $type: 'item-group',
                    drip: {
                        $type: 'item-group',
                    },
                    autoCollect: {
                        $type: 'item-group',
                    },
                },
                customCSS: {
                    $type: 'code',
                    source: '',
                    language: 'css',
                },
            },
            appVersion: '1.0.0',
        };

        const asset = document.createElement('pt-form');
        asset.setAttribute('config', JSON.stringify(config));
        asset.setAttribute('style', 'width: 100%;');
        document.body.appendChild(asset);
        shadowRoot = document.body.querySelector('pt-form')!.shadowRoot!;
    });

    it('submit data', async () => {
        let submitData: Array<any> = [];

        document.body.addEventListener('form-answer', (e: any) => {
            submitData.push(e.detail);
        });

        const choiceBofPage1 = shadowRoot.querySelector('fieldSet>div>label:nth-child(1)') as HTMLLabelElement;
        choiceBofPage1.click();

        await sleep();

        const choiceAofPage2 = shadowRoot.querySelector('fieldSet>div>label:nth-child(1)') as HTMLLabelElement;
        choiceAofPage2.click();

        const choiceCofPage2 = shadowRoot.querySelector('fieldSet>div>label:nth-child(2)') as HTMLLabelElement;
        choiceCofPage2.click();

        let nextButton = shadowRoot.querySelector('button.pt-next-button') as HTMLButtonElement;
        nextButton.click();
        await sleep();

        let input = shadowRoot.querySelector('input') as HTMLInputElement;
        input.value = 'test';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        nextButton.click();
        await sleep();

        const completeText = shadowRoot.querySelector('pt-text p p') as HTMLParagraphElement;
        expect(completeText.innerText).toBe('Thanks');

        expect(submitData.length).toEqual(3);

        expect(submitData[2]).toEqual({
            form_answer_state: 'complete',
            选择1: 'A',
            选择2: 'A,B',
            问答1: 'test',
        });
    });
});
