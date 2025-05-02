import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import { UnauthorizedError } from '../utils/make-error.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = async (c: Context, next: Next) => {
    // Try to get token from cookie first
    const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? ''

    if (!token) {
        throw new UnauthorizedError('No token provided');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('user', decoded);
    await next();
};
