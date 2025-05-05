import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { fileUploadSchema, getCommentsByPostIdParams, getPostParamsSchema, getPostResponse, getPostsPaginatedQuerySchema, getPostsPaginatedResponse, loginRequest, loginResponse, makeCommentResponse, makeCommentSchema, makePostResponse, makePostSchema, registerSchema, makeLikeParams, makeLikeResponse, makeRatingResponse, makeRatingSchema, getPostRatingResponse, getPostRatingParams } from './schema.js';

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
    path: '/protected/upload',
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

export const getPostsPaginatedRoute = createRoute({
    method: 'get',
    path: '/posts',
    summary: 'Get paginated posts',
    description: 'Returns a paginated list of posts.',
    tags: ['posts'],
    request: {
        query: getPostsPaginatedQuerySchema,
    },
    responses: {
        200: {
            description: 'Paginated posts',
            content: {
                'application/json': {
                    schema: getPostsPaginatedResponse
                }
            }
        }
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

export const makeCommentRoute = createRoute({
    method: 'post',
    path: '/comments',
    summary: 'Create a new comment',
    description: 'Creates a new comment for a given post ID.',
    tags: ['comments'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: makeCommentSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Comment created',
            content: {
                'application/json': {
                    schema: makeCommentResponse
                }
            }
        }
    }
});

export const makeLikeRoute = createRoute({
    method: 'post',
    path: '/posts/{id}/like',
    summary: 'Like a post',
    description: 'Increment the like count for a post by its ID.',
    tags: ['posts'],
    request: {
        params: makeLikeParams,
    },
    responses: {
        200: {
            description: 'Like added',
            content: {
                'application/json': {
                    schema: makeLikeResponse
                }
            }
        }
    }
});

export const logoutRoute = createRoute({
    method: 'post',
    path: '/auth/logout',
    summary: 'Log out a user',
    description: 'Logs out a user by invalidating the JWT token.',
    tags: ['auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: z.object({})
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Logout successful',
        }

    }
});


export const ratingRoute = createRoute({
    method: 'post',
    path: '/rate',
    summary: 'Rate a post',
    description: 'Allows a user to rate a post.',
    tags: ['ratings'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: makeRatingSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Rating processed',
            content: {
                'application/json': {
                    schema: makeRatingResponse
                }
            }
        }
    }
});

export const getPostRatingRoute = createRoute({
    method: 'get',
    path: '/posts/{postId}/rating',
    summary: 'Get post rating',
    description: 'Fetches the average rating and total number of ratings for a specific post.',
    tags: ['ratings'],
    request: {
        params: getPostRatingParams
    },
    responses: {
        200: {
            description: 'Post rating fetched successfully',
            content: {
                'application/json': {
                    schema: getPostRatingResponse
                },
            },
        },
    },
});

export const getAllExistingRoutesRoute = createRoute({
    method: 'get',
    path: '/posts/routes',
    summary: 'Get all existing routes',
    description: 'Fetches all existing routes in the application.',
    tags: ['posts'],
    responses: {
        200: {
            description: 'All existing routes fetched successfully',
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        routes: z.array(z.string()),
                        totalRoutes: z.number()
                    })
                },
            },
        },
        400: {
            description: 'No routes found',
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                    })
                },
            },
        },
    },
});

export const deletePostRoute = createRoute({
    method: 'delete',
    path: '/protected/posts/{id}',
    summary: 'Delete a post',
    description: 'Deletes a post by its ID. Returns the deleted post.',
    tags: ['posts'],
    request: {
        params: z.object({
            id: z.string().min(1).openapi({
                param: { name: 'id', in: 'path', description: 'Post ID to delete' },
                example: 'post-uuid',
            }),
        }),
    },
    responses: {
        200: {
            description: 'Post deleted',
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string(),
                        post: z.any(),
                    }),
                },
            },
        },
        404: {
            description: 'Post not found',
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
    },
});