import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getCollection("cybersec");
  const site = `${context.site?.toString() ?? "https://wolfgirl.dev"}/cybersec`;
  return rss({
    title: "PolyWolf On Security",
    description:
      "reposts of various cybersecurity-themed news that i find interesting",
    site,
    items: posts
      .map((post) => {
        return {
          link: `${site}/${post.slug}`,
          content: sanitizeHtml(parser.render(post.body)),
          title: post.data.title,
          pubDate: new Date(post.slug.slice(0, 10) + "T12:00:00"),
        };
      })
      .reverse(),
    customData: `<language>en-us</language>`,
  });
}
