import { db } from '../../../db/connection.js';
import { ratings } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import type { Context, Handler } from 'hono';
import { ValidationError } from '../../../utils/make-error.js';
import { z } from 'zod';

const getPostRatingParams = z.object({
    postId: z.string().nonempty(),
});

export const getPostRatingHandler: Handler = async (c: Context) => {
    const params = c.req.param();
    const parseResult = getPostRatingParams.safeParse(params);
    if (!parseResult.success) {
        throw new ValidationError(`Invalid input: ${JSON.stringify(parseResult.error.errors)}`);
    }
    const { postId } = parseResult.data;

    // Fetch all ratings for the given post
    const ratingsData = await db.select({ rating: ratings.rating }).from(ratings).where(eq(ratings.postId, postId));

    if (ratingsData.length === 0) {
        return c.json({ message: 'No ratings found for this post', averageRating: null, totalRatings: 0 }, 200);
    }

    // Calculate the average rating
    const totalRatings = ratingsData.length;
    const averageRating = ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return c.json({
        message: 'Ratings fetched successfully',
        averageRating,
        totalRatings,
    }, 200);
};