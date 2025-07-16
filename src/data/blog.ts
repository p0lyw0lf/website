import {
  getCollection,
  type CollectionEntry,
  type InferEntrySchema,
} from "astro:content";
import { toBlogUrl } from "./url";

export interface BlogData extends Omit<InferEntrySchema<"blog">, "published"> {
  published: Date;
  url: string;
}

export const toBlogData = (post: CollectionEntry<"blog">): BlogData => ({
  ...post.data,
  published: new Date(post.data.published * 1000),
  url: toBlogUrl(post.id),
});

/**
 * Returns a list of all posts, sorted descending by date.
 */
export const getBlogData = async (): Promise<BlogData[]> => {
  const posts = await getCollection("blog");
  const data = posts.map(toBlogData);
  data.sort((a, b) => b.published.valueOf() - a.published.valueOf());
  return data;
};

interface BlogPost {
  previous: BlogData | undefined;
  current: BlogData;
  next: BlogData | undefined;
}

/**
 * Returns a list of all posts, will previous and next posts included.
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const data = await getBlogData();

  const posts = data.map(
    (datum): BlogPost => ({
      previous: undefined,
      current: datum,
      next: undefined,
    }),
  );

  posts.forEach((post, i) => {
    if (i > 0) {
      post.previous = posts[i - 1]!.current;
    }
    if (i < posts.length - 1) {
      post.next = posts[i + 1]!.current;
    }
  });

  return posts;
};

type BlogDataByTag = Map<BlogData["tags"][number], BlogData[]>;

/**
 * Returns a mapping of tag -> posts in that tag.
 *
 * ENSURES: (
 *   \forall tag.
 *     \result[tag] === undefined OR
 *     \foreach post in \result[tag]. post.tags.includes(tag)
 * ) AND (
 *   \foreach post in getBlogData().
 *     \exists tag. \result[tag] !== undefined
 * )
 */
export const getBlogDataByTag = async (): Promise<BlogDataByTag> => {
  const data = await getBlogData();
  const byTag: BlogDataByTag = new Map();

  for (const datum of data) {
    for (const tag of datum.tags) {
      const list = byTag.get(tag) ?? [];
      list.push(datum);
      byTag.set(tag, list);
    }
  }

  return byTag;
};
