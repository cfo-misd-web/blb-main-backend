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
    token: z.string().optional(),
})


export const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6)
});

export const fileUploadSchema = z.object({
    file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size exceeds 5MB',
    }).refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
        message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
    }),
});

export const makePostSchema = z.object({
    title: z.string().min(1),
    route: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).optional(),
    author: z.string().optional(),
    bannerImg: z.string().optional(),
    content: z.string().min(1),
    publishedDate: z.string().optional(),
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
    userId: z.string().min(1),
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
    search: z.string().optional().openapi({
        param: { name: 'search', in: 'query', description: 'Search string for filtering posts by title or content' },
        example: 'news',
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

export const makeRatingSchema = z.object({
    postId: z.string().nonempty(),
    userId: z.string().nonempty(),
    rating: z.number().int().min(1).max(5),
});

export const makeRatingResponse = z.object({
    message: z.string(),
    rating: z.object({
        id: z.string(),
        postId: z.string(),
        userId: z.string(),
        rating: z.number(),
        createdAt: z.number(),
        updatedAt: z.number(),
    }),
});

export const getPostRatingParams = z.object({
    postId: z.string().nonempty(),
})

export const getPostRatingResponse = z.object({
    message: z.string(),
    averageRating: z.number().nullable(),
    totalRatings: z.number(),
})

export const emailSchema = z.object({
    to: z.string().email(),
    name: z.string().nonempty(),
    subject: z.string().nonempty(),
    text: z.string().optional(),
});
