import { verify } from '@node-rs/argon2';
import { prisma } from '../db';
import { validateEmailData, validatePasswordData } from '../utils/form';

export default eventHandler(async (event) => {
    const data = await readBody(event);
    const email = validateEmailData(data.email);
    const password = validatePasswordData(data.password);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
        throw createError({
            message: '邮箱或密码不正确',
            statusCode: 400,
        });
    }

    const passwordMatch = await verify(existingUser.password, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    if (!passwordMatch) {
        throw createError({
            message: '邮箱或密码不正确',
            statusCode: 400,
        });
    }

    console.log('User logged in:', existingUser);
    const session = await lucia.createSession(existingUser.id, {});
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize());
});
