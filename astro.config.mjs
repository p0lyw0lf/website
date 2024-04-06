import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), sitemap(), mdx()],
  site: "https://wolfgirl.dev",

  cacheDir: "./.astro-cache",
});
