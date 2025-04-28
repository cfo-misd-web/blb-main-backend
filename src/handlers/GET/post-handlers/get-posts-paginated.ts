import { count } from 'drizzle-orm';
import { db } from '../../../db/connection.js';
import { posts } from '../../../db/schema.js';
import type { Context, Handler } from 'hono';
import { z } from 'zod';

export const getPostsPaginatedQuerySchema = z.object({
    page: z.string().optional().default('1'),
    pageSize: z.string().optional().default('10'),
});

export const getPostsPaginatedHandler: Handler = async (c: Context) => {
    const { page, pageSize } = getPostsPaginatedQuerySchema.parse(c.req.query());
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const sizeNum = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
    const offset = (pageNum - 1) * sizeNum;

    const postsResult = await db.select().from(posts).limit(sizeNum).offset(offset);
    const totalResult = await db.$count(posts)

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
