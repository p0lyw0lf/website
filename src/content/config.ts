import { defineCollection } from "astro:content";
import { z } from "astro:content";

const cybersec = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    direct_link: z.string(),
  }),
});

export const collections = {
  cybersec,
};
