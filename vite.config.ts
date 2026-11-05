import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages는 https://jeongph.github.io/gojuon/ 경로로 서빙되므로 base를 레포명으로 둔다.
export default defineConfig({
  plugins: [react()],
  base: '/gojuon/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
