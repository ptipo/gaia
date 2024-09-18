import { loadAppBundle } from '~/lib/app';
import { prisma } from '../../../db';
import { z } from 'zod';
import type { AppDef, Concept } from '@hayadev/configurator';

const payloadSchema = z.object({
    kind: z.union([z.literal('user-input'), z.literal('elaboration')]),
    data: z.string(),
    currentModel: z.any().optional(),
    aspect: z.enum(['content', 'design', 'setting']).optional(),
});

export default eventHandler(async (event) => {
    if (!event.context.user) {
        throw createError({
            message: 'Unauthorized',
            statusCode: 403,
        });
    }

    const id = getRouterParam(event, 'id');
    const asset = await prisma.asset.findUnique({ where: { id }, include: { app: true } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const appBundle = await loadAppBundle(asset.app.bundle, 'config');
    const appConfig = appBundle.module.config as AppDef<Concept>;
    if (!appConfig) {
        throw createError({
            message: 'App does not have a config',
            statusCode: 500,
        });
    }

    if (!appConfig.generateModel) {
        throw createError({
            message: 'App does not support model generation',
            statusCode: 500,
        });
    }

    const payload = await readBody(event);
    const parsed = payloadSchema.parse(payload);

    const result = await appConfig.generateModel({
        ...parsed,
        secrets: asset.app.secrets ?? undefined,
        userIdentity: event.context.user.email,
    });
    console.log(`Model generation response: ${JSON.stringify(result)}`);

    return { success: true, data: result };
});
