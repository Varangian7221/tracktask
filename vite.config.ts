import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  test: {
    // jsdom даёт window/localStorage для тестов слоя хранения
    environment: 'jsdom',
  },
});