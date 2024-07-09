export default eventHandler(async (event) => {
    if (!event.context.user) {
        throw createError({
            message: 'Unauthorized',
            statusCode: 403,
        });
    }

    const id = getRouterParam(event, 'id');
    const asset = await event.context.db.asset.findUnique({ where: { id } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const clone = await event.context.db.asset.create({
        data: {
            name: `${asset.name} (副本)`,
            appVersion: asset.appVersion,
            config: asset.config ?? undefined,
            app: {
                connect: {
                    id: asset.appId,
                },
            },
            owner: {
                connect: {
                    id: event.context.user.id,
                },
            },
        },
    });

    return { success: true, data: clone };
});
