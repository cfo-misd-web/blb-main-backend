import { db } from '@/db/connection.js';
import { posts } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import type { Context, Handler } from 'hono';
import { z } from 'zod';
import { ValidationError } from '@/utils/make-error.js';

export const getPostParamsSchema = z.object({
    id: z.string().min(1),
});

export const getPostHandler: Handler = async (c: Context) => {
    const { id } = getPostParamsSchema.parse(c.req.param());
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!result.length) {
        throw new ValidationError('Post not found');
    }
    return c.json({ post: result[0] });
};
