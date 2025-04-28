import type { Context, Handler } from 'hono';
import { ForbiddenError, ValidationError } from '@/utils/make-error.js';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/db/connection.js';
import { media } from '@/db/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadHandler: Handler = async (c: Context) => {
    const baseUrl = c.req.url.replace(/\/$/, '');
    const b_url = new URL(baseUrl);
    const body = await c.req.parseBody();
    const file = body.file as File;
    if (!file) {
        throw new ValidationError('File not found in request');
    }
    if (!file.type.startsWith('image/')) {
        throw new ValidationError('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
        throw new ForbiddenError('file size exceeds 5MB');
    }
    // Save file with relative path
    const filePath = path.join('server', 'uploads', file.name); // relative path
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    // Save record in DB
    const id = uuidv4();
    const url = `/media/${file.name}`;
    await db.insert(media).values({
        id,
        path: filePath,
        url
    });
    return c.json({ message: 'Upload successful', filename: file.name, url });
};