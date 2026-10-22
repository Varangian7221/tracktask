import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom даёт window/localStorage для тестов слоя хранения
    environment: 'jsdom',
  },
});
