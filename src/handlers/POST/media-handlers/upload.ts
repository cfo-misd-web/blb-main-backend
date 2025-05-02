import type { Context, Handler } from 'hono';
import { ForbiddenError, ValidationError } from '../../../utils/make-error.js';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../../../db/connection.js';
import { media } from '../../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export const uploadHandler: Handler = async (c: Context) => {
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
    // Check if file already exists (by name and size)
    const filePath = path.join('server', 'uploads', file.name); // relative path
    let exists = false;
    try {
        const stats = await fs.stat(filePath);
        if (stats.size === file.size) {
            exists = true;
        }
    } catch {
        // File does not exist
    }

    if (exists) {
        // Find existing record in DB
        const existing = await db.select().from(media).where(eq(media.path, filePath)).limit(1);
        if (existing.length > 0) {
            return c.json({
                message: 'File already exists',
                filename: file.name,
                url: existing[0].url
            }, 200);
        }
    }

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const id = uuidv4();
    const url = `/media/${file.name}`;
    await db.insert(media).values({
        id,
        path: filePath,
        url
    });
    return c.json({ message: 'Upload successful', filename: file.name, url });
};