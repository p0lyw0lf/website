import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { toBlogData } from "../../data/blog";

export async function GET(context: APIContext) {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await post.render();
      const content = await container.renderToString(Content);
      const data = toBlogData(post);
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
