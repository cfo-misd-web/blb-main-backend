import { db } from '../../../db/connection.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import type { Context, Handler } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { registerSchema } from '../../../zod-schema/schema.js';
import { hashPassword } from '../../../utils/hash-password.js';
import { ValidationError } from '../../../utils/make-error.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export const registerHandler: Handler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { email, name, password } = parseResult.data!;
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
        throw new Error(`user with ${email} already exists`)
    }
    const passwordHash = await hashPassword(password);
    const inserted = await db.insert(users).values({ id: uuidv4(), email, name, passwordHash }).returning({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt, updatedAt: users.updatedAt });
    if (!inserted || inserted.length === 0) {
        throw new Error('failed to register user');
    }
    const user = inserted[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return c.json({ message: 'Registration successful', user, token }, 201);
};