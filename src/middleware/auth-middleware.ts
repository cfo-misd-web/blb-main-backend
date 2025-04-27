import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    console.log('Authorization Header:', authHeader)
    if (!authHeader) {
        return c.json({ error: 'Unauthorized: No Authorization header' }, 401);
    }

    // Remove 'Bearer ' prefix if it exists, otherwise use the full header
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log('Token:', token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        c.set('user', decoded);
        await next();
    } catch (e) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
};
