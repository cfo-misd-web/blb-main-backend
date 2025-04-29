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
import { getCommentsByPostIdRoute, getPostRoute, loginroute, makeCommentRoute, makePostRoute, registerRoute, uploadmediaRoute, getPostsPaginatedRoute, makeLikeRoute, logoutRoute } from './zod-schema/openapi-route.js'
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

const app = new OpenAPIHono()

app.use(logger())
app.use(cors())

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: "balinkbayan API",
    version: '0.0.1canary',
  },
})

app.get('/reference', Scalar({ pageTitle: 'balinkbayan API reference', url: '/openapi.json' }))

app.get('/', frontPageHandler)



// error handling middleware

app.onError(errorHandlerMiddleware)

// public routes

app.openapi(registerRoute, registerHandler)
app.openapi(loginroute, loginHandler)
app.openapi(logoutRoute, logoutHandler)
app.openapi(getCommentsByPostIdRoute, getCommentsByPostIdHandler)
app.openapi(getPostRoute, getPostHandler)
app.openapi(makeCommentRoute, makeCommentHandler)

app.get('/media/:filename', serveMediaHandler)

// protected routes

app.use('/protected/*', authMiddleware)

app.openapi(uploadmediaRoute, uploadHandler)
app.openapi(makePostRoute, makePostHandler)
app.openapi(getPostsPaginatedRoute, getPostsPaginatedHandler)
app.openapi(makeLikeRoute, makeLikeHandler)

app.get('/health', healthHandler)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
