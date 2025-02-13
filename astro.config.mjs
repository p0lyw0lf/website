import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { SITE_URL } from "./src/data/url";
import rehypeEnhancedTables from "./src/plugins/rehypeEnhancedTables";
import rehypeRaw from "rehype-raw";
import { allowedRemoteDomains } from "./src/data/config";
import remarkCollectRemoteImages from "./src/plugins/remarkCollectRemoteImages";
import rehypeRemoteImages from "./src/plugins/rehypeRemoteImages";

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
    remarkPlugins: [remarkCollectRemoteImages],
    rehypePlugins: [rehypeRemoteImages, rehypeRaw, rehypeEnhancedTables],
  },

  image: {
    domains: allowedRemoteDomains,
    experimentalLayout: "full-width",
  },

  cacheDir: "./.astro-cache",
});
