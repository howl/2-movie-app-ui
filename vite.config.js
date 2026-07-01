import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  envPrefix: 'MOVIE_',
  test: {
    setupFiles: ['./src/tests/setup.js'],
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
