import { verify } from '@node-rs/argon2';
import { prisma } from '../db';
import { validateEmailData, validatePasswordData } from '../utils/form';

export default eventHandler(async (event) => {
    const formData = await readFormData(event);
    const email = validateEmailData(formData.get('email'));
    const password = validatePasswordData(formData.get('password'));

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
        throw createError({
            message: 'Incorrect username or password',
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
            message: 'Incorrect username or password',
            statusCode: 400,
        });
    }

    console.log('User logged in:', existingUser);
    const session = await lucia.createSession(existingUser.id, {});
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize());
});
