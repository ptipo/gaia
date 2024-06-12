import { enhance } from '@zenstackhq/runtime';
import { createEventHandler } from '@zenstackhq/server/nuxt';
import { prisma } from '~/server/db';

export default createEventHandler({
    getPrisma: async (event) => {
        return enhance(prisma, { user: event.context.user });
    },
});
