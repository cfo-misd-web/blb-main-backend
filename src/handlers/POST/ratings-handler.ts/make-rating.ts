import { db } from '../../../db/connection.js';
import { ratings } from '../../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import type { Context, Handler } from 'hono';
import { ValidationError } from '../../../utils/make-error.js';
import { makeRatingSchema } from '../../../zod-schema/schema.js';
import { eq, and } from 'drizzle-orm';
import { logger } from 'hono/logger';

export const makeRatingHandler: Handler = async (c: Context) => {
    const parseResult = makeRatingSchema.safeParse(await c.req.json());
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult)}`);
    }
    const { postId, userId, rating } = parseResult.data;

    // Check if a rating already exists for the user and post
    const existingRating = await db.select().from(ratings).where(and(eq(ratings.postId, postId), eq(ratings.userId, userId))).limit(1);

    let savedRating;
    if (existingRating.length > 0) {
        // Update the existing rating
        const updated = await db.update(ratings).set({ rating }).where(eq(ratings.id, existingRating[0].id)).returning();
        if (!updated || updated.length === 0) {
            throw new Error('Failed to update rating');
        }
        savedRating = updated[0];
    } else {
        // Create a new rating
        const id = uuidv4();
        const inserted = await db.insert(ratings).values({
            id,
            postId,
            userId,
            rating,
        }).returning();
        if (!inserted || inserted.length === 0) {
            throw new Error('Failed to create rating');
        }
        savedRating = inserted[0];
    }

    return c.json({ message: 'Rating processed successfully', rating: savedRating }, existingRating.length > 0 ? 200 : 201);
};