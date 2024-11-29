import { SUPER_LOGIN_COOKIE_NAME } from '../../types/constants';

export default eventHandler(async (event) => {
    if (!event.context.session) {
        throw createError({
            statusCode: 403,
        });
    }
    await lucia.invalidateSession(event.context.session.id);

    const blankCookie = lucia.createBlankSessionCookie();
    appendHeader(event, 'Set-Cookie', blankCookie.serialize());

    //remove super-login cookie
    blankCookie.name = SUPER_LOGIN_COOKIE_NAME;
    appendHeader(event, 'Set-Cookie', blankCookie.serialize());
});
