import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE_URL, STATIC_URL } from "./src/data/url";
import rehypeEnhancedTables from "./src/plugins/rehypeEnhancedTables";
import rehypeRaw from "rehype-raw";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: SITE_URL.toString(),

  markdown: {
    rehypePlugins: [rehypeRaw, rehypeEnhancedTables],
  },

  image: {
    domains: [STATIC_URL.host],
  },

  cacheDir: "./.astro-cache",
});
