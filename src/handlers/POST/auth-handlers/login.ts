import { db } from '../../../db/connection.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { Buffer } from 'node:buffer';
import { subtle } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Context } from 'hono';
import { loginSchema } from '../../../zod-schema/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

async function verifyPassword(storedHash: string, providedPassword: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(providedPassword);
    const hashBuffer = await subtle.digest('SHA-256', data);
    const providedHash = Buffer.from(hashBuffer).toString('hex');
    return storedHash === providedHash;
}


export const loginHandler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
        return c.json({ error: 'Invalid input', details: parseResult.error.errors }, 400);
    }
    const { email, password } = parseResult.data;
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (found.length === 0) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }
    const user = found[0];
    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { passwordHash, ...userData } = user;

    return c.json({ message: 'Login successful', user: userData, token });
};