import * as reactPlugin from 'vite-plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/auth': {
        target: 'http://localhost:3000/',
      }
    }
  },
  plugins: [reactPlugin]
}

export default config
