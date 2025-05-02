
import { makeError } from "../utils/make-error.js";
import { type Context } from 'hono';

export async function errorHandlerMiddleware(err: Error, c: Context) {
    const { error, statusCode } = makeError(err);
    return c.json({
        error: error.message,
        statusCode: statusCode,
    }, statusCode);
};