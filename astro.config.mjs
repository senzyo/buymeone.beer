import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://buymeone.beer',
  build: {
    format: 'file',
  },
  devToolbar: {
    enabled: false,
  },
});
