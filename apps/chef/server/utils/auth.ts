import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '../db';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !process.dev,
        },
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            email: attributes.email,
        };
    },
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
}
