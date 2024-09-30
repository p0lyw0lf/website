import { defineCollection } from "astro:content";
import { z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.string().array(),
    published: z.number().int().nonnegative(),
  }),
});

const cybersec = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    direct_link: z.string(),
  }),
});

export const collections = {
  blog,
  cybersec,
};
