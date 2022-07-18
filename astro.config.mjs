import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import image from '@astrojs/image';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    experimental: {
        integrations: true,
    },
    integrations: [
        svelte(),
        image(),
        compress(),
    ],
});
