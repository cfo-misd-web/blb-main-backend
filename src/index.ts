import 'module-alias/register.js'
import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { registerHandler } from './handlers/POST/auth-handlers/register.js'
import { loginHandler } from './handlers/POST/auth-handlers/login.js'
import { uploadHandler } from './handlers/POST/media-handlers/upload.js'
import { serveMediaHandler } from './handlers/GET/media-handlers/serve-media.js'
import { authMiddleware } from './middleware/auth-middleware.js'
import { errorHandlerMiddleware } from './middleware/error-middleware.js'
import { Scalar } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import { getCommentsByPostIdRoute, getPostRoute, loginroute, makeCommentRoute, makePostRoute, registerRoute, uploadmediaRoute, getPostsPaginatedRoute, makeLikeRoute, logoutRoute, ratingRoute, getPostRatingRoute, getAllExistingRoutesRoute, deletePostRoute, getPostbyrouteRoute } from './zod-schema/openapi-route.js'
import { makePostHandler } from './handlers/POST/post-handlers/make-post.js'
import { getPostHandler } from './handlers/GET/post-handlers/get-post-handler.js'
import { getCommentsByPostIdHandler } from './handlers/GET/comments-handler/get-comments-by-id.js'
import { makeCommentHandler } from './handlers/POST/comments-handler/make-comment.js'
import { frontPageHandler } from './handlers/GET/static-page/front-page-handler.js'
import { healthHandler } from './handlers/GET/health.js'
import { cors } from 'hono/cors'
import { getPostsPaginatedHandler } from './handlers/GET/post-handlers/get-posts-paginated.js'
import { makeLikeHandler } from './handlers/POST/post-handlers/make-like.js';
import { logoutHandler } from './handlers/POST/auth-handlers/logout.js'
import { makeRatingHandler } from './handlers/POST/ratings-handler.ts/make-rating.js'
import { getPostRatingHandler } from './handlers/GET/rating-handler/get-post-rating.js'
import { getAllExistingRoutesHandler } from './handlers/GET/post-handlers/get-all-existing-routes.js'
import { deletePostHandler } from './handlers/POST/post-handlers/delete-post.js'
import { sendEmailHandler } from './handlers/POST/contact-handler/mail-handler.js';
import { sendEmailRoute } from './zod-schema/openapi-route.js';
import { getPostbyRouteHandler } from './handlers/GET/post-handlers/get-post-by-route.js'

const app = new OpenAPIHono()

app.use(logger())


app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://beta.balinkbayan.gov.ph', 'https://balinkbayan.gov.ph'] : 'http://localhost:2000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

app.doc('/yuagdkdbgajhvhavfhj.json', {
  openapi: '3.0.0',
  info: {
    title: "balinkbayan API",
    version: '0.0.1canary',
  },
})

app.get('/kggggdkpCFOwebmisd32jsahdjkashdkajd', Scalar({ pageTitle: 'balinkbayan API reference', url: '/yuagdkdbgajhvhavfhj.json' }))

app.get('/', frontPageHandler)


// List all available routes

// error handling middleware

app.onError(errorHandlerMiddleware)

app.openapi(getAllExistingRoutesRoute, getAllExistingRoutesHandler)

// public routes
app.get('/health', healthHandler)

app.openapi(registerRoute, registerHandler)
app.openapi(loginroute, loginHandler)
app.openapi(logoutRoute, logoutHandler)
app.openapi(getCommentsByPostIdRoute, getCommentsByPostIdHandler)
app.openapi(getPostRoute, getPostHandler)
app.openapi(getPostbyrouteRoute, getPostbyRouteHandler)
app.openapi(makeCommentRoute, makeCommentHandler)
app.openapi(ratingRoute, makeRatingHandler)
app.openapi(getPostRatingRoute, getPostRatingHandler)
app.openapi(makeLikeRoute, makeLikeHandler)

app.get('/media/:filename', serveMediaHandler)



// protected routes

app.use('/protected/*', authMiddleware)

app.openapi(uploadmediaRoute, uploadHandler)
app.openapi(makePostRoute, makePostHandler)
app.openapi(deletePostRoute, deletePostHandler)
app.openapi(getPostsPaginatedRoute, getPostsPaginatedHandler)
app.openapi(sendEmailRoute, sendEmailHandler)




serve({
  fetch: app.fetch,
  port: 2233
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
