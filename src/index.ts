import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { registerHandler } from './handlers/POST/auth-handlers/register.js'
import { loginHandler } from './handlers/POST/auth-handlers/login.js'
import { uploadHandler } from './handlers/POST/media-handlers/upload.js'
import { serveMediaHandler } from './handlers/GET/media-handlers/serve-media.js'
import { authMiddleware } from './middleware/auth-middleware.js'
import { errorHandlerMiddleware } from './middleware/error-middleware.js'
import { Scalar } from '@scalar/hono-api-reference'


const app = new OpenAPIHono()

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

app.post('/auth/register', registerHandler)

app.post('/auth/login', loginHandler)

app.post('/media/upload', uploadHandler)

app.get('/media/serve/:filename', serveMediaHandler)

// protected routes

app.use('/protected/*', authMiddleware)

app.get('/protected/data', (c) => {
  return c.json({ message: 'This is protected data' })
})



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
