// vite.config.js
// ─────────────────────────────────────────────────────────────
//  Configuración de Vite con el plugin oficial de Tailwind v4
// ─────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
