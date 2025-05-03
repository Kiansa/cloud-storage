# Cloud Storage API

A lightweight, self-hosted cloud storage solution for managing files and directories on your own server. Provides a REST API for seamless file operations, including GET, POST, and DELETE for files and directories. Ideal for developers seeking a customizable, secure, and scalable storage backend.
You can simply use a subdomain like cloud.yourdomain.com and host it on your server.

## Features

- File upload with automatic UUID naming
- Secure file retrieval
- File deletion
- Bearer token authentication
- Supports various file types (images, documents, archives, etc.)

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```sh
npm install
```

3. Create `.env.local` and `.env.production` file with the following variables:

```env.local
VITE_API_TOKEN = enter any token you want
VITE_URL = http://localhost:4000
VITE_PRIVATE_STORAGE_PATH = ./static/storage
VITE_PUBLIC_STORAGE_PATH = ./static/public
```

```env.production
VITE_API_TOKEN = enter any token you want
VITE_URL = https://cloud.yourdomain.com
VITE_PRIVATE_STORAGE_PATH = ./storage
VITE_PUBLIC_STORAGE_PATH = ./public
```

4. Start development server:

```sh
npm run dev
```

5. Build for production:

```sh
npm run build
```

and then copy the `app.mjs` from `dist` directory and upload it to your domain directory of the server.

6. How to run it on your server:

- Enable the node extenstion on your domain or subdomain (e.g. cloud.yourdomain.com)
- Set the document root to the `public` folder (create it if not exists) (e.g. /cloud.yourdomain.com/public)
- Set the application root (e.g. /cloud.yourdomain.com)
- Set application startup file to `app.mjs`
- Enable the node.js application and that's it! (you don't need to install or run any commands)

7. In order to avoid CORS issues, create a .htaccess file in the `public` folder and add the following lines:

```apache
<IfModule mod_headers.c>
  <FilesMatch ".*">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
  </FilesMatch>
</IfModule>

```

---

## API Endpoints

All requests require Bearer token authentication.

### POST `/v1/upload` – Upload File to Storage

**Headers:**
`Content-Type: multipart/form-data`

**Body Parameters:**

- `file`: File (required) – The file to upload
- `dir`: string (required) – Destination directory (e.g., `"images"`, `"foo/bar"`)
- `storage`: 'private' | 'public' (optional. defaults to 'private') – Set to `'public'` to make the file publicly accessible

**Response:**

```json
{
  "path": "string",    // File storage path
  "name": "string",    // Original file name
  "mime": "string",    // MIME type
  "url": "string"      // Public URL if `public` is true, otherwise empty
}
```

---

### GET `/v1/storage/:filepath` – Retrieve File

**Response:**
Returns the requested file along with metadata.

---

### DELETE `/v1/storage/:filepath` – Delete File

**Response:**

```json
{
  "message": "File deleted successfully"
}
```

## Environment Variables

- `VITE_API_TOKEN`: Authentication token for API access
- `VITE_URL`: Base URL of the service
- `VITE_PRIVATE_STORAGE_PATH`: Path for private file storage
- `VITE_PUBLIC_STORAGE_PATH`: Path for public file storage (accessible via URL)

## Tech Stack

- Hono
- Vite
- TypeScript
- Node.js
