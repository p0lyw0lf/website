import { glob } from "./data/collections.js";
import { z } from "./data/z.js";

export const art = glob({
  pattern: /([^_][^\/]*)\.mdx$/,
  base: "src/content/art",
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    title: z.optional(z.string()),
    published: z.int(),
    tags: z.array(z.string()),
  }),
});

export const blog = glob({
  pattern: /([^_][^\/]*)\.md$/,
  base: "src/content/blog",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    published: z.int(),
    mastodon: z.optional(z.string()),
    bluesky: z.optional(z.string()),
  }),
});

export const cybersec = glob({
  pattern: /([^_][^\/]*)\.md$/,
  base: "src/content/cybersec",
  schema: z.object({
    title: z.string(),
    repost_link: z.string(),
  }),
});
