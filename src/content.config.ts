import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const art = defineCollection({
  loader: glob({ pattern: "[^_]*.mdx", base: "src/content/art" }),
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    title: z.string().optional(),
    published: z.number().int().nonnegative(),
    tags: z.string().array(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "[^_]*.md", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.string().array(),
    published: z.number().int().nonnegative(),
    mastodon: z.string().optional(),
    bluesky: z.string().optional(),
  }),
});

const cybersec = defineCollection({
  loader: glob({ pattern: "[^_]*.md", base: "src/content/cybersec" }),
  schema: z.object({
    title: z.string(),
    repost_link: z.string(),
  }),
});

export const collections = {
  art,
  blog,
  cybersec,
};
