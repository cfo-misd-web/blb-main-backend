import type { Context } from 'hono';
import { ForbiddenError, makeError, ValidationError } from '@/utils/make-error.js';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/db/connection.js';
import { media } from '@/db/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadHandler = async (c: Context) => {
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
    const uploadsDir = path.resolve('server', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, file.name);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const id = uuidv4();
    const url = `/media/${file.name}`;
    await db.insert(media).values({
        id,
        postId: "idk",
        path: filePath,
        url
    });
    return c.json({ message: 'Upload successful', filename: file.name, url });
};