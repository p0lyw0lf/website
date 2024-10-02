import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE_URL, STATIC_URL } from "./src/data/url";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: SITE_URL.toString(),

  image: {
    domains: [STATIC_URL.host],
  },

  cacheDir: "./.astro-cache",
});
