import { createRoute, z } from '@hono/zod-openapi'
import { loginRequest, loginResponse, registerSchema } from './schema.js'



export const loginroute = createRoute({
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
    tags: ['auth'],
})

export const registerRoute = createRoute({
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
    tags: ['auth'],
})

