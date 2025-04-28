import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type { Context, Handler } from 'hono';
import { z } from 'zod';
import { ValidationError } from '../../../utils/make-error.js';

const makeLikeParams = z.object({
    id: z.string().min(1),
});

export const makeLikeHandler: Handler = async (c: Context) => {
    const { id } = makeLikeParams.parse(c.req.param());
    // Increment likes atomically and return the updated row
    const [updated] = await db.update(posts)
        .set({ likes: sql`${posts.likes} + 1` })
        .where(eq(posts.id, id))
        .returning();
    if (!updated) {
        throw new ValidationError('Post not found');
    }
    return c.json({ message: 'Like added', likes: updated.likes });
};
