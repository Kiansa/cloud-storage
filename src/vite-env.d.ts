/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_TOKEN: string
  readonly VITE_URL: string
  readonly VITE_PRIVATE_STORAGE_PATH: string
  readonly VITE_PUBLIC_STORAGE_PATH: string
  readonly VITE_GITHUB_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
