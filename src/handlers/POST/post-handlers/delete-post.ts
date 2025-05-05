import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import type { Handler } from 'hono';
import { z } from 'zod';
import { ValidationError } from '../../../utils/make-error.js';

const deletePostParams = z.object({
    id: z.string().min(1),
});

export const deletePostHandler: Handler = async (c) => {
    const { id } = deletePostParams.parse(c.req.param());
    const deleted = await db.delete(posts).where(eq(posts.id, id)).returning();
    if (!deleted || deleted.length === 0) {
        throw new ValidationError('Post not found');
    }
    return c.json({ message: 'Post deleted', post: deleted[0] });
};
