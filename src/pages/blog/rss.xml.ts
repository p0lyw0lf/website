import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getBlogEntries, toFeedItem } from "../../data/blog";
import { SITE_URL } from "../../data/url";

export async function GET() {
  const container = await AstroContainer.create();

  const entries = await getBlogEntries();
  const items = await Promise.all(entries.map(toFeedItem(container)));

  return rss({
    title: "PolyWolf's Blog",
    description: "a blog written by PolyWolf",
    site: new URL("/blog/", SITE_URL).toString(),
    items,
    customData: `<language>en-us</language>`,
  });
}
