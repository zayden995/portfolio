// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Powers canonical URLs and og:url. Change this if the domain changes.
  site: 'https://zaydenchua-portfolio.vercel.app',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
