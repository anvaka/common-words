import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // The site is served from https://anvaka.github.io/common-words/, so all
  // asset links have to be relative.
  base: './',
  plugins: [vue()],
  build: {
    sourcemap: true,
  },
});
