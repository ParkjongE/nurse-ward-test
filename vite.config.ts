import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 상대 경로로 빌드해 GitHub Pages 등 하위 경로에서도 동작하게 한다.
  base: './',
  plugins: [react()],
})