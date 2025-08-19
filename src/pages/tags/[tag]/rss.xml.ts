import rss from "@astrojs/rss";
import type { GetStaticPaths } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { type CollectionEntry } from "astro:content";
import { getBlogEntries, toFeedItem, type BlogData } from "../../../data/blog";
import { SITE_URL } from "../../../data/url";

type BlogDataByTag = Map<BlogData["tags"][number], CollectionEntry<"blog">[]>;
const entries = await getBlogEntries();
const byTag: BlogDataByTag = new Map();

for (const entry of entries) {
  for (const tag of entry.data.tags) {
    const list = byTag.get(tag) ?? [];
    list.push(entry);
    byTag.set(tag, list);
  }
}

export const getStaticPaths = (async () => {
  return [...byTag.keys()].map((tag) => ({ params: { tag } }));
}) satisfies GetStaticPaths;

export async function GET({ params: { tag } }: { params: { tag: string } }) {
  const container = await AstroContainer.create();

  const items = await Promise.all(byTag.get(tag)!.map(toFeedItem(container)));

  return rss({
    title: `PolyWolf's Blog - #${tag}`,
    description: `all posts tagged "${tag}" on a blog written by PolyWolf`,
    site: new URL(`/tags/${tag}/`, SITE_URL).toString(),
    items,
    customData: `<language>en-us</language>`,
  });
}
