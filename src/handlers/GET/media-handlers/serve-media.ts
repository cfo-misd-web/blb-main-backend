import fs from 'fs/promises';
import path from 'path';
import type { Context } from 'hono';
import { z } from 'zod';
import { makeError, NotFoundError } from '@/utils/make-error.js';

export const serveMediaHandler = async (c: Context) => {
    const filename = c.req.param('filename');

    const safefilename = z.string().safeParse(filename)
    if (!safefilename.success) {
        throw new Error('invalid request: internal server error');
    }

    const filePath = path.resolve('server', 'uploads', safefilename.data!);

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
    return new Response(data, { headers: { 'Content-Type': contentType } });

};
