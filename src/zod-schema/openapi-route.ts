import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { fileUploadSchema, getCommentsByPostIdParams, getPostParamsSchema, getPostResponse, loginRequest, loginResponse, makeCommentResponse, makePostResponse, makePostSchema, registerSchema } from './schema.js';

export const loginroute = createRoute({
    summary: 'Log in a user',
    description: 'Logs in a user with email and password. Returns a JWT token and user data.',
    tags: ['auth'],
    method: 'post',
    path: '/auth/login',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: loginRequest
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: loginResponse
                },
            },
            description: 'log in a user',
        },
    },
})

export const registerRoute = createRoute({
    summary: 'Register a new user',
    description: 'Registers a new user with email, name, and password. Returns a JWT token and user data.',
    tags: ['auth'],
    method: 'post',
    path: '/auth/register',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: registerSchema
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: loginResponse
                },
            },
            description: 'register a user',
        },
    },
})

export const makePostRoute = createRoute({
    method: 'post',
    path: '/protected/posts',
    summary: 'Create a new post',
    description: 'Creates a new post with a title, content, and userId. Optionally includes a banner image.',
    tags: ['posts'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: makePostSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Post created',
            content: {
                'application/json': {
                    schema: makePostResponse
                }
            }
        }
    }
});

export const uploadmediaRoute = createRoute({
    method: 'post',
    path: '/upload',
    summary: 'Upload an image',
    description: 'Uploads an image file (max 5MB) and stores it on the server. Only image files are allowed.',
    tags: ['media'],
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: fileUploadSchema
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Upload successful',
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        filename: z.string(),
                        url: z.string(),
                    }),
                },
            },
        },
    },
});


export const getPostRoute = createRoute({
    method: 'get',
    path: '/posts/{id}',
    summary: 'Get a post by ID',
    description: 'Retrieves a single post by its unique ID.',
    tags: ['posts'],
    request: {
        params: getPostParamsSchema,
    },
    responses: {
        200: {
            description: 'Post found',
            content: {
                'application/json': {
                    schema: getPostResponse
                }
            }
        },
    }
});



export const getCommentsByPostIdRoute = createRoute({
    method: 'get',
    path: '/comments/by-post/{postId}',
    summary: 'Get comments by post ID',
    description: 'Retrieves all comments for a given post ID.',
    tags: ['comments'],
    request: {
        params: getCommentsByPostIdParams,
    },
    responses: {
        200: {
            description: 'Comments found',
            content: {
                'application/json': {
                    schema: z.object({
                        comments: makeCommentResponse
                    })
                }
            }
        }
    }
});
