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

and then copy the `app.mjs` in the `dist` directory to your domain directory of the server.

6. Run it on your server:

- Enable the node extenstion on your domain or subdomain (e.g. cloud.yourdomain.com)
- Set the document root to the `public` folder (create it if not exists) (e.g. /cloud.yourdomain.com/public)
- Set the application root (e.g. /cloud.yourdomain.com)
- Set application startup file to `app.mjs`
- Enable the node.js application and that's it! (you don't need to install or run any commands)

## API Endpoints

All endpoints require Bearer token authentication.

### Upload File

```http
POST /v1/upload
Content-Type: multipart/form-data

Parameters:
- file: File (required)
- dir: string (optional) - Target directory

Returns: file path
```

### Get File

```http
GET /v1/storage/:filepath

Returns: File with metadata
```

### Delete File

```http
DELETE /v1/storage/:filepath

Returns: Success message
```

## Environment Variables

- `VITE_API_TOKEN`: Authentication token for API access
- `VITE_URL`: Base URL of the service
- `VITE_PRIVATE_STORAGE_PATH`: Path for private file storage
- `VITE_PUBLIC_STORAGE_PATH`: Path for public file storage

## Tech Stack

- Hono
- Vite
- TypeScript
- Node.js
