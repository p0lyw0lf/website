import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import image from '@astrojs/image';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    experimental: {
        integrations: true,
    },
    integrations: [
        compress(),
        image(),
        svelte(),
        sitemap(),
    ],
    site: 'https://wolfgirl.dev',
});
