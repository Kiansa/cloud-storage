// #region 📂 imports
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
// #endregion 📂 imports

// #region 📂 Common functions

// upload file to private storage
export async function upload(dir: string, file: File, storage: 'private' | 'public') {
  try {
    const storagePath =
      storage === 'public'
        ? import.meta.env.VITE_PUBLIC_STORAGE_PATH
        : import.meta.env.VITE_PRIVATE_STORAGE_PATH
    const fileExtension = path.extname(file.name) // Extract file extension
    const uniqueName = crypto.randomUUID() + fileExtension
    const trimmedDir = trimDir(dir) // Trim the directory path

    // Determine upload path based on environment
    const dirPath = path.join(storagePath, trimmedDir)
    const uploadPath = path.join(dirPath, uniqueName)
    await ensureDirectoryExists(dirPath) // Ensure the directory exists

    const buffer = Buffer.from(await file.arrayBuffer()) // Convert File to Buffer

    await new Promise<void>((resolve, reject) => {
      fs.writeFile(uploadPath, buffer, (err) => {
        if (err) {
          console.error(err.message)
          reject(err)
        } else resolve()
      })
    }) // Write the file to disk

    return {
      path: `${trimmedDir}/${uniqueName}`,
      name: file.name,
      mime: file.type,
      url: storage === 'public' ? `${import.meta.env.VITE_URL}/${trimmedDir}/${uniqueName}` : '',
    }
  } catch (error: any) {
    throw new Error(`Error uploading file: ${error.message}`)
  }
}

// get file from private storage
export async function getFile(filepath: string) {
  try {
    const filePath = path.join(import.meta.env.VITE_PRIVATE_STORAGE_PATH, filepath)

    // Check if file exists first
    await new Promise<void>((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) reject(new Error(`File not found: ${filepath}`))
        else resolve()
      })
    })

    // Get file stats (for content-length, etc.)
    const stats = await new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) reject(err)
        else resolve(stats)
      })
    })

    // Get file data as buffer
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })

    // Determine MIME type based on file extension
    const fileExtension = path.extname(filePath).toLowerCase()
    const mimeType = getMimeType(fileExtension)

    // Return all relevant file information
    return {
      buffer: fileBuffer,
      size: stats.size,
      mimeType,
      fileName: path.basename(filePath),
      lastModified: stats.mtime,
    }
  } catch (error: any) {
    throw new Error(`Error getting file: ${error.message}`)
  }
}

// delete file from private storage
export async function deleteFile(filepath: string) {
  try {
    const filePath = path.join(import.meta.env.VITE_PRIVATE_STORAGE_PATH, filepath)

    // Check if file exists first
    await new Promise<void>((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) reject(new Error(`File not found: ${filepath}`))
        else resolve()
      })
    })

    // Delete the file
    await new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  } catch (error: any) {
    throw new Error(`Error deleting file: ${error.message}`)
  }
}

// #endregion 📂 Common functions

// #region 📂 helper functions

// ensure directory exists if not create it
export function ensureDirectoryExists(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err.message}`)
        reject(err)
      } else {
        console.log(`Directory created: ${dir}`)
        resolve()
      }
    })
  })
}

// trim dir to remove leading and trailing slashes
export function trimDir(dir: string) {
  return dir.replace(/^\/+|\/+$/g, '')
}

// Helper function to determine MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Text & Documents
    '.txt': 'text/plain',
    '.csv': 'text/csv',

    // Data formats
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.yaml': 'application/yaml',
    '.yml': 'application/yaml',

    // Office documents
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pdf': 'application/pdf',

    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.avif': 'image/avif',

    // Archives
    '.zip': 'application/zip',
  }

  return mimeTypes[extension] || 'application/octet-stream' // Default to binary
}

// #endregion 📂 helper functions
