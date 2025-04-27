import { db } from '../../../db/connection.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import type { Context } from 'hono';

import { registerSchema } from '../../../zod-schema/schema.js';
import { hashPassword } from '../../../utils/has-password.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';



export const registerHandler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
        return c.json({ error: 'Invalid input', details: parseResult.error.errors }, 400);
    }
    const { email, name, password } = parseResult.data;
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
        return c.json({ error: 'Email already in use' }, 409);
    }
    const passwordHash = await hashPassword(password);
    const inserted = await db.insert(users).values({ email, name, passwordHash }).returning({ id: users.id, email: users.email, name: users.name });
    if (!inserted || inserted.length === 0) {
        return c.json({ error: 'Failed to register user' }, 500);
    }
    const user = inserted[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return c.json({ message: 'Registration successful', user, token }, 201);
};