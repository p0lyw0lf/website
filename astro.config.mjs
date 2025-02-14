import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeRaw from "rehype-raw";
import { allowedRemoteDomains } from "./src/data/config";
import { SITE_URL } from "./src/data/url";
import rehypeEnhancedTables from "./src/plugins/rehypeEnhancedTables";

const BAD_URLS = new Set(["/404.html"].map((path) => new URL(path, SITE_URL)));

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc({ allowHTML: true, ignoreIndentation: true }),
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
    domains: allowedRemoteDomains,
  },

  cacheDir: "./.astro-cache",
});
