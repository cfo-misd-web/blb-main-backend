import type { Context, Next } from 'hono';

export const errorMiddleware = async (c: Context, next: Next) => {
    try {
        await next();
    } catch (err: any) {
        const status = err.status || 500;
        const message = err.message || 'Internal Server Error';
        return c.json({ error: message }, status);
    }
};

