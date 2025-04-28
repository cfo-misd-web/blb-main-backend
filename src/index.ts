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
import { getCommentsByPostIdRoute, getPostRoute, loginroute, makePostRoute, registerRoute, uploadmediaRoute } from './zod-schema/openapi-route.js'
import { makePostHandler } from './handlers/POST/post-handlers/make-post.js'
import { getPostHandler } from './handlers/GET/post-handlers/get-post-handler.js'
import { getCommentsByPostIdHandler } from './handlers/GET/comments-handler/get-comments-by-id.js'


const app = new OpenAPIHono()

app.use(logger())

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: "balinkbayan API",
    version: '0.0.1canary',
  },

})

app.get('/reference', Scalar({ url: '/openapi.json' }))

app.get('/', (c) => {
  return c.html('all g! systems ready to go!')
})

// error handling middleware

app.onError(errorHandlerMiddleware)

// public routes

app.openapi(registerRoute, registerHandler)
app.openapi(loginroute, loginHandler)
app.openapi(uploadmediaRoute, uploadHandler)
app.openapi(getCommentsByPostIdRoute, getCommentsByPostIdHandler)

app.get('/media/:filename', serveMediaHandler)

// protected routes

app.use('/protected/*', authMiddleware)

app.openapi(makePostRoute, makePostHandler)
app.openapi(getPostRoute, getPostHandler)



app.get('/protected/data', (c) => {
  return c.json({ message: 'This is protected data' })
})



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
