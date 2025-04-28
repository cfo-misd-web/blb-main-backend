import { z } from 'zod';

export const filenameParam = z.object({
    filename: z
        .string()
        .nonempty()
        .openapi({
            param: {
                name: 'filename',
                description: 'The name of the file to be served',
                in: 'path',
            },
            example: 'Screenshot%202024-07-05%20151707.png',
        }),
})


export const loginRequest = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginResponse = z.object({
    message: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string().min(1),
        createdAt: z.number(),
        updatedAt: z.number(),
    }),
    token: z.string()
})


export const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6)
});

export const fileUploadSchema = z.object({
    file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size exceeds 5MB',
    }),
});

export const makePostSchema = z.object({
    title: z.string().min(1),
    author: z.string().optional(),
    bannerImg: z.string().optional(),
    content: z.string().min(1),
});

export const makePostResponse = z.object({
    message: z.string(),
    post: z.object({
        id: z.string(),
        title: z.string(),
        bannerImg: z.string().nullable(),
        content: z.string(),
        userId: z.string(),
        createdAt: z.number(),
        updatedAt: z.number(),
    })
});

export const getPostParamsSchema = z.object({
    id: z.string().min(1),
});
export const getPostResponse = z.object({
    post: z.object({
        id: z.string(),
        title: z.string(),
        bannerImg: z.string().nullable(),
        content: z.string(),
        userId: z.string(),
        createdAt: z.number(),
        updatedAt: z.number(),
    })
});

export const getCommentsByPostIdParams = z.object({
    postId: z.string().min(1),
});

export const makeCommentSchema = z.object({
    content: z.string().min(1),
    fname: z.string().optional(),
    lname: z.string().optional(),
    email: z.string().email(),
    cId: z.string().min(1),
    postId: z.string().nonempty()
});

export const makeCommentResponse = z.object({
    message: z.string(),
    comment: z.object({
        id: z.string(),
        content: z.string(),
        fname: z.string().nullable(),
        lname: z.string().nullable(),
        email: z.string(),
        cId: z.string(),
        postId: z.string(),
        createdAt: z.number(),
        updatedAt: z.number(),
    })
});

export const getPostsPaginatedQuerySchema = z.object({
    page: z.string().optional().default('1').openapi({
        param: { name: 'page', in: 'query', description: 'Page number (1-based)' },
        example: '1',
    }),
    pageSize: z.string().optional().default('10').openapi({
        param: { name: 'pageSize', in: 'query', description: 'Number of posts per page (max 100)' },
        example: '10',
    }),
});

export const getPostsPaginatedResponse = z.object({
    posts: z.array(z.object({
        id: z.string(),
        title: z.string(),
        author: z.string().nullable(),
        bannerImg: z.string().nullable(),
        content: z.string(),
        likes: z.number(),
        createdAt: z.number(),
        updatedAt: z.number(),
    })),
    pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});

export const makeLikeParams = z.object({
    id: z.string().min(1).openapi({
        param: { name: 'id', in: 'path', description: 'Post ID to like' },
        example: 'post-uuid',
    }),
});

export const makeLikeResponse = z.object({
    message: z.string(),
    likes: z.number(),
});
