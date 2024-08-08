import { prisma } from '../../../db';
export default eventHandler(async (event) => {
    if (!event.context.user) {
        throw createError({
            message: 'Unauthorized',
            statusCode: 403,
        });
    }
    const { email } = event.context.user;

    const id = getRouterParam(event, 'id');
    const asset = await prisma.asset.findUnique({ where: { id }, include: { app: true } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const aiApiKey = asset.app.aiApiKey;

    if (!aiApiKey) {
        throw createError({
            message: 'AI API key not found',
            statusCode: 500,
        });
    }

    const { prompt } = await readBody(event);

    const requestBody = {
        inputs: {
            requirements: prompt,
        },
        response_mode: 'blocking',
        user: email,
    };

    const response = await fetch(process.env.AI_API_ENDPOINT!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + aiApiKey,
        },
        body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();

    console.log(`AI response:${JSON.stringify(responseBody)}`);

    const responseData = responseBody.data.outputs.text;

    const cleanedJsonString = responseData.replace(/^\s*`+json\n/, '').replace(/\n`+\s*$/, '');

    const responseJson: Object = JSON.parse(cleanedJsonString);

    return { success: true, data: { json: responseJson } };
});
