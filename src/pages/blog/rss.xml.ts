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

  const posts = await getCollection("blog");
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await post.render();
      const content = await container.renderToString(Content);
      const link = new URL(
        `/blog/${post.slug}/`,
        context.url.origin,
      ).toString();
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });
      return {
        link,
        content: sanitizedContent,
        title: post.data.title,
        pubDate: new Date(post.data.published * 1000),
        categories: post.data.tags,
      };
    }),
  );

  return rss({
    title: "PolyWolf's Blog",
    description: "a blog written by PolyWolf",
    site: new URL("/blog/", context.url.origin).toString(),
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
