import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { registerHandler } from './handlers/POST/auth-handlers/register.js'
import { loginHandler } from './handlers/POST/auth-handlers/login.js'
import { authMiddleware } from './middleware/auth-middleware.js'
import { errorMiddleware } from './middleware/error-middleware.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// error handling middleware

app.use(errorMiddleware)

// public routes

app.post('/register', registerHandler)

app.post('/login', loginHandler)

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
