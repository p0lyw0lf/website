import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE_URL, STATIC_URL } from "./src/data/url";
import rehypeEnhancedTables from "./src/plugins/rehypeEnhancedTables";
import rehypeRaw from "rehype-raw";

const BAD_URLS = new Set(["/404.html"].map((path) => new URL(path, SITE_URL)));

// https://astro.build/config
export default defineConfig({
  experimental: {
    responsiveImages: true,
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (url) => !BAD_URLS.has(url),
    }),
  ],
  site: SITE_URL.toString(),
  trailingSlash: "always",

  markdown: {
    rehypePlugins: [rehypeRaw, rehypeEnhancedTables],
  },

  image: {
    domains: [STATIC_URL.host],
    experimentalLayout: "full-width",
  },

  cacheDir: "./.astro-cache",
});
