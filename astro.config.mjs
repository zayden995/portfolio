// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Update this to your real domain before deploying — it powers canonical URLs.
  site: 'https://example.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
