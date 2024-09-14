import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";

export async function GET(context: APIContext) {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("cybersec");
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await post.render();
      const content = await container.renderToString(Content);
      const link = new URL(
        `/cybersec/${post.slug}/`,
        context.url.origin,
      ).toString();
      return {
        link,
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        title: post.data.title,
        pubDate: new Date(post.slug.slice(0, 10) + "T12:00:00"),
      };
    }),
  );

  return rss({
    title: "PolyWolf On Security",
    description:
      "reposts of various cybersecurity-themed news that i find interesting",
    site: new URL("/cybersec/", context.url.origin).toString(),
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
