import { verify } from '@node-rs/argon2';
import { prisma } from '../db';
import { validateEmailData, validatePasswordData } from '../utils/form';
import { Cookie } from 'lucia';
import { SUPER_LOGIN_COOKIE_NAME } from '../../types/constants';

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

    let loginUser = existingUser;

    if (data.impersonatedEmail) {
        const allowImpersonate = (existingUser.permission as any)?.impersonate;

        if (!allowImpersonate) {
            throw createError({
                message: '没有登录其他账号的权限',
                statusCode: 403,
            });
        }
        const impersonatedUser = await prisma.user.findUnique({ where: { email: data.impersonatedEmail } });

        if (!impersonatedUser) {
            throw createError({
                message: '模拟用户邮箱不存在',
                statusCode: 400,
            });
        }

        loginUser = impersonatedUser;
    }

    console.log('User logged in:', loginUser);
    const session = await lucia.createSession(loginUser.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    appendHeader(event, 'Set-Cookie', sessionCookie.serialize());

    if (data.impersonatedEmail) {
        const superLoginCookie = new Cookie(SUPER_LOGIN_COOKIE_NAME, email, {
            path: '/',
        });
        appendHeader(event, 'Set-Cookie', superLoginCookie.serialize());
    }
});
