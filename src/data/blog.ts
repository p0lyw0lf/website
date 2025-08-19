import type { experimental_AstroContainer as AstroContainer } from "astro/container";
import {
  getCollection,
  render,
  type CollectionEntry,
  type InferEntrySchema,
} from "astro:content";
import sanitizeHtml from "sanitize-html";
import { toBlogUrl } from "./url";

export interface BlogData extends Omit<InferEntrySchema<"blog">, "published"> {
  published: Date;
  url: string;
}

export const toBlogData = (entry: CollectionEntry<"blog">): BlogData => ({
  ...entry.data,
  published: new Date(entry.data.published * 1000),
  url: toBlogUrl(entry.id),
});

export const toFeedItem =
  (container: AstroContainer) => async (entry: CollectionEntry<"blog">) => {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);
    const data = toBlogData(entry);
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    });
    return {
      link: data.url.toString(),
      content: sanitizedContent,
      title: data.title,
      pubDate: data.published,
      categories: data.tags,
    };
  };

let cachedEntries: Array<CollectionEntry<"blog">> | null = null;
export const getBlogEntries = async (): Promise<
  Array<CollectionEntry<"blog">>
> => {
  if (cachedEntries) return cachedEntries;
  const entries = await getCollection("blog");
  entries.sort((a, b) => b.data.published - a.data.published);
  cachedEntries = entries;
  return entries;
};

/**
 * Returns a list of all posts, sorted descending by date.
 */
export const getBlogData = async (): Promise<BlogData[]> => {
  const entries = await getBlogEntries();
  const data = entries.map(toBlogData);
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
