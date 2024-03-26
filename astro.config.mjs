import {defineConfig} from 'astro/config';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), sitemap(), mdx(), compress()],
  site: 'https://wolfgirl.dev',

  cacheDir: "./.astro-cache",
});
