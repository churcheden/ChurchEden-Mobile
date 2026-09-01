import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// Mobile unit tests target pure logic and mocked services. The node environment
// avoids pulling in react-native / expo native modules. Tests that touch
// AsyncStorage or the API client mock those modules explicitly.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
