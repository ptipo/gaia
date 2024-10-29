import { defineApp, ModelGenerationResult, t } from '@hayadev/configurator';
import { Form } from './form/form';

const DEFAULT_USER_IDENTITY = 'chef@haya.dev';

export const FormApp = defineApp({
    concept: Form,

    generateModelHint: (args) => {
        console.log('Generate model hint:', args);

        if (args.aspect === 'design') {
            return args.ct(t`aiGenerateDesignHint`);
        }

        return args.kind === 'user-input' ? args.ct(t`aiGenerateContentHint1`) : args.ct(t`aiGenerateContentHint2`);
    },

    generateModel: async (args) => {
        console.log(`Generating model for "${args.aspect}":`, args.data);

        const requestBody = {
            inputs: {
                requirements: args.data,
            },
            response_mode: 'blocking',
            user: args.userIdentity ?? DEFAULT_USER_IDENTITY,
        };
        console.log('AI request:', JSON.stringify(requestBody));

        const apiKey =
            args.kind === 'user-input'
                ? (args.secrets as any)?.contentElaborationAPIKey
                : (args.secrets as any)?.contentModelAPIKey;

        const response = await fetch('https://ptminder.ptengine.com/v1/workflows/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });
        const json = await response.json();
        console.log('AI raw response:', JSON.stringify(json));

        try {
            if (json.data?.status !== 'succeeded' || typeof json.data?.outputs?.text !== 'string') {
                throw new Error('AI response does not contain expected data');
            }

            let result: ModelGenerationResult;
            if (args.kind === 'user-input') {
                result = { kind: 'elaboration' as const, result: json.data.outputs.text };
                console.log('Model elaboration generation response:', result);
            } else {
                result = { kind: 'model' as const, result: JSON.parse(json.data.outputs.text) };
                console.log('Model config generation response:', result);
            }
            return result;
        } catch (e) {
            console.error('Error parsing AI response:', e);
            throw e;
        }
    },

    supportedGenerateAspects: () => ['content', 'design'],
});
