import {
  getCollection,
  type CollectionEntry,
  type InferEntrySchema,
} from "astro:content";
import { toArtUrl } from "./url";

export interface ArtData extends Omit<InferEntrySchema<"art">, "published"> {
  published: Date;
  url: string;
}

export const toArtData = (post: CollectionEntry<"art">): ArtData => ({
  ...post.data,
  published: new Date(post.data.published * 1000),
  url: toArtUrl(post.data.src),
});

export const getArtData = async (): Promise<ArtData[]> => {
  const posts = await getCollection("art");
  const data = posts.map(toArtData);
  data.sort((a, b) => b.published.valueOf() - a.published.valueOf());
  return data;
};
