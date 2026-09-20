import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://clasificadoslasflores.com.ar',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
