import { Hono } from 'hono'
import { deleteFile, getFile, upload } from '@/handlers/util'

const app = new Hono()

  .get('/', (c) => {
    return c.text('Hello from v1!')
  })

  // upload file to private storage and return the path to the file
  .post('/upload', async (c) => {
    try {
      const body = await c.req.parseBody()
      console.log('body', body)
      const file = body['file']
      const dir = body['dir']
      const storage = body['storage'] ?? 'private'
      if (!file) {
        console.log('file is empty')
        return c.text('files cannot be empty!', 400)
      }
      if (typeof file === 'string') {
        console.log('file is string')
        return c.text('Invalid file type!', 400)
      }
      const result = await upload(dir as string, file as File, storage as 'private' | 'public')
      return c.json(result)
    } catch (error: any) {
      return c.text(`Error uploading file: ${error.message}`, 500)
    }
  })

  // get the file from private storage and return the path to the file
  .get('/storage/:filepath{.*}', async (c) => {
    // take away /v1 from the beginning of the path
    const filepath = c.req.param('filepath')
    const file = await getFile(filepath)
    return c.json(file)
  })

  // delete the file from private storage
  .delete('/storage/:filepath{.*}', async (c) => {
    const filepath = c.req.param('filepath')
    await deleteFile(filepath)
    return c.text('File deleted successfully')
  })

export default app
