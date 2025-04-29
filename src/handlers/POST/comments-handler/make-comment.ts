import { db } from '../../../db/connection.js';
import { comments } from '../../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import type { Context, Handler } from 'hono';
import { ValidationError } from '../../../utils/make-error.js';
import { makeCommentSchema } from '../../../zod-schema/schema.js';

export const makeCommentHandler: Handler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = makeCommentSchema.safeParse(body);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { content, fname, lname, email, userId, postId } = parseResult.data;
    const id = uuidv4();
    const inserted = await db.insert(comments).values({
        content,
        fname: fname || null,
        lname: lname || null,
        id,
        email,
        userId,
        postId,
    }).returning();
    if (!inserted || inserted.length === 0) {
        throw new Error('Failed to create comment');
    }
    return c.json({ message: 'Comment created', comment: inserted[0] }, 201);
};
