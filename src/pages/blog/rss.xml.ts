import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { toBlogData } from "../../data/blog";
import { SITE_URL } from "../../data/url";

export async function GET() {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("blog");
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
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
    site: new URL("/blog/", SITE_URL).toString(),
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
