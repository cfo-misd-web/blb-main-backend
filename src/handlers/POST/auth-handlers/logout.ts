import type { Handler } from 'hono';
import { setCookie } from 'hono/cookie';

export const logoutHandler: Handler = async (c) => {
    setCookie(c, 'jwt', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
    });
    return c.json({ message: 'Logged out successfully' });
};
