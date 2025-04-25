import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite automatically injects every VITE_* variable from .env, .env.local, etc.
export default defineConfig({
  plugins: [react()]
});
