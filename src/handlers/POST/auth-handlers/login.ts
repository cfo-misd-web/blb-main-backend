import { db } from '@/db/connection.js';
import { users } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import type { Context } from 'hono';
import { loginRequest } from '@/zod-schema/schema.js';
import { makeError, NotFoundError, ValidationError } from '@/utils/make-error.js';
import { verifyPassword } from '@/utils/verify-password.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export const loginHandler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = loginRequest.safeParse(body);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { email, password } = parseResult.data!;
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (found.length === 0) {
        throw new NotFoundError(`user with ${email} not found`);
    }
    const user = found[0];
    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
        throw new Error('invalid password');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { passwordHash, ...userData } = user;

    return c.json({ message: 'Login successful', user: userData, token });
};