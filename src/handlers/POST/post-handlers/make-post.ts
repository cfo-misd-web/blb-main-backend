import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import type { Context, Handler } from 'hono';
import { ValidationError } from '../../../utils/make-error.js';
import { makePostSchema } from '../../../zod-schema/schema.js';



export const makePostHandler: Handler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = makePostSchema.safeParse(body);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { title, bannerImg, content, author, publishedDate, tags, description, route } = parseResult.data;
    const id = uuidv4();

    const inserted = await db.insert(posts).values({
        id,
        title,
        author,
        bannerImg: bannerImg ?? null,
        content,
        route,
        tags: tags ? JSON.stringify(tags) : '[]',
        description,
        createdAt: publishedDate ? new Date(publishedDate).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    }).returning();
    if (!inserted || inserted.length === 0) {
        throw new Error('Failed to create post');
    }
    return c.json({ message: 'Post created', post: inserted[0] }, 201);
};
