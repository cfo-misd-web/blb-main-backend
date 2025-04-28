import { db } from '@/db/connection.js';
import { comments } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import type { Context, Handler } from 'hono';
import { z } from 'zod';

const getCommentsByPostIdParams = z.object({
    postId: z.string().min(1),
});

export const getCommentsByPostIdHandler: Handler = async (c: Context) => {
    const { postId } = getCommentsByPostIdParams.parse(c.req.param());
    const result = await db.select().from(comments).where(eq(comments.postId, postId));
    return c.json({ comments: result });
};
