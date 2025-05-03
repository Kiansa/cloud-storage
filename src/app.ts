import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { logger } from 'hono/logger'
import v1 from '@/routes/v1'
// import { bodyLimit } from 'hono/body-limit'

const app = new Hono()
app.use('*', bearerAuth({ token: import.meta.env.VITE_API_TOKEN }))
app.use(logger())
// app.notFound((c) => {
//   return c.text('404 Not Found', 404)
// })
// app.onError((err, c) => {
//   console.error(err.message)
//   return c.text(err.message, 500)
// })

// Use routes
app.route('/v1', v1)

console.log('app started!')

export default app
