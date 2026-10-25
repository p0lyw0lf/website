import { glob } from "../../lib/data/collections.js";
import { z } from "../../lib/data/z.js";
import { toBlogUrl, toCybersecUrl } from "../urls.js";

/**
 * @param {(slug: string) => string} toUrl
 * @returns {(slug: string) => string} toPath
 */
const pathOf = (toUrl) => (slug) => {
  const path = toUrl(slug);
  // Remove leading `/`
  return path.slice(1) + "index.html";
};

export const art = glob({
  pattern: /\/([^_][^\/]*)\.mdx$/,
  base: "src/content/art",
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    title: z.optional(z.string()),
    published: z.int(),
    tags: z.array(z.string()),
  }),
  toOutputPath: () => "NONE",
});

export const blog = glob({
  pattern: /\/([^_][^\/]*)\.md$/,
  base: "src/content/blog",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    published: z.int(),
    mastodon: z.optional(z.string()),
    bluesky: z.optional(z.string()),
  }),
  toOutputPath: pathOf(toBlogUrl),
});

export const cybersec = glob({
  pattern: /\/([^_][^\/]*)\.md$/,
  base: "src/content/cybersec",
  schema: z.object({
    title: z.string(),
    repost_link: z.string(),
  }),
  toOutputPath: pathOf(toCybersecUrl),
});
