import { defineConfig } from 'vite'
import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    devServer({
      entry: './src/app.ts', // The file path of your application.
    }),
    build({
      entry: './src/app.ts',
      port: 4014,
      output: 'app.mjs',
      outputDir: './dist',
      staticPaths: ['static'],
      external: [],
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 4014,
  },
})
