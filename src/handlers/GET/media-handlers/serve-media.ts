import fs from 'fs/promises';
import path from 'path';
import type { Context } from 'hono';
import { z } from 'zod';
import { NotFoundError } from '@/utils/make-error.js';
import { db } from '@/db/connection.js';
import { media } from '@/db/schema.js';
import { eq } from 'drizzle-orm';

export const serveMediaHandler = async (c: Context) => {
    const filename = c.req.param('filename');

    if (!filename) {
        throw new NotFoundError('invalid request: no filename provided');
    }

    const safefilename = z.string().safeParse(filename)
    if (!safefilename.success) {
        throw new Error('invalid request: internal server error');
    }

    const url = `/media/${safefilename.data}`;
    const record = await db.select().from(media).where(eq(media.url, url)).limit(1);
    if (!record.length) {
        throw new NotFoundError('invalid request: file not found in database');
    }
    const filePath = record[0].path;
    const fileExists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
        throw new NotFoundError('invalid request: file not found');
    }
    const data = await fs.readFile(filePath);
    if (!data) {
        throw new NotFoundError('invalid request: file not found');
    }
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.bmp') contentType = 'image/bmp';
    return c.body(data, 200, {
        "Content-Type": contentType,
    });
};
