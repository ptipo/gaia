import { Prisma } from '@prisma/client';
import { Argon2id } from 'oslo/password';
import { prisma } from '../db';
import { validateEmailData, validatePasswordData } from '../utils/form';

export default eventHandler(async (event) => {
    const data = await readBody(event);
    const email = validateEmailData(data.email);
    const password = validatePasswordData(data.password);

    const hashedPassword = await new Argon2id().hash(password);

    try {
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        const session = await lucia.createSession(user.id, {});
        appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize());
        console.log('User created:', user);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            throw createError({
                message: '邮箱已被注册',
                statusCode: 500,
            });
        } else {
            throw createError({
                message: 'An unknown error occurred',
                statusCode: 500,
            });
        }
    }
});
