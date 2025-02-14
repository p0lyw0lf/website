import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "[^_]*.mdoc", base: "src/content/blog" }),
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
    direct_link: z.string(),
  }),
});

export const collections = {
  blog,
  cybersec,
};
