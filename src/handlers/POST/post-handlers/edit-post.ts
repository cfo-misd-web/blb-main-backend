import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import type { Context, Handler } from 'hono';
import { ValidationError } from '../../../utils/make-error.js';
import { editPostSchema, makePostSchema } from '../../../zod-schema/schema.js';
import { eq } from 'drizzle-orm';

export const editPostHandler: Handler = async (c: Context) => {
    const { routeID } = c.req.param();
    if (!routeID) {
        throw new ValidationError('Route parameter is required');
    }
    const body = await c.req.json();
    const parseResult = editPostSchema.safeParse(body);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { title, bannerImg, content, author, publishedDate, tags, description } = parseResult.data;

    const existingPost = await db.select().from(posts).where(eq(posts.route, routeID)).limit(1);
    if (!existingPost.length) {
        throw new ValidationError(`Post with route ${routeID} not found`);
    }
    const post = existingPost[0];

    const updated = await db.update(posts).set({
        title : title ?? post.title,
        author : author ?? post.author,
        bannerImg: bannerImg ?? post.bannerImg,
        content: content ?? post.content,   
        tags: tags ? JSON.stringify(tags) : '[]',
        description,
        createdAt: publishedDate ? new Date(publishedDate).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    }).where(eq(posts.route, routeID)).returning();

    if (!updated || updated.length === 0) {
        throw new Error('Failed to update post or post not found');
    }

    return c.json({ message: 'Post updated', post: updated[0] }, 200);
};