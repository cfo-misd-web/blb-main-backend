import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import type { Context, Handler } from 'hono';
import { getPostsPaginatedQuerySchema } from '../../../zod-schema/schema.js';
import { desc, like, or } from 'drizzle-orm';

export const getPostsPaginatedHandler: Handler = async (c: Context) => {
    const { page, pageSize, search } = { ...getPostsPaginatedQuerySchema.parse(c.req.query()), ...c.req.query() };
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const sizeNum = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
    const offset = (pageNum - 1) * sizeNum;

    let postsResult;
    let totalResult;
    if (search && typeof search === 'string' && search.trim() !== '') {
        const searchStr = `%${search.trim()}%`;
        postsResult = await db.select().from(posts)
            .where(or(like(posts.title, searchStr), like(posts.content, searchStr)))
            .orderBy(desc(posts.createdAt)) // Sort by date in descending order
            .limit(sizeNum).offset(offset);

        const countResult = await db.select({ count: posts.id }).from(posts)
            .where(or(like(posts.title, searchStr), like(posts.content, searchStr)));
        totalResult = countResult.length;
    } else {
        postsResult = await db.select().from(posts)
            .orderBy(desc(posts.createdAt)) // Sort by date in descending order
            .limit(sizeNum).offset(offset);
        const countResult = await db.select({ count: posts.id }).from(posts);
        totalResult = countResult.length;
    }

    return c.json({
        posts: postsResult,
        pagination: {
            page: pageNum,
            pageSize: sizeNum,
            total: totalResult,
            totalPages: Math.ceil(totalResult / sizeNum),
        },
    });
};
