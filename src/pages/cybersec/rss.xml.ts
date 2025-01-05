import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { SITE_URL } from "../../data/url";

export async function GET() {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getCollection("cybersec");
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      const link = new URL(`/cybersec/${post.id}/`, SITE_URL).toString();
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });
      const fullContent =
        `<a href="${post.data.direct_link}">${post.data.direct_link}</a><br/>` +
        sanitizedContent;
      return {
        link,
        content: fullContent,
        title: post.data.title,
        pubDate: new Date(post.id.slice(0, 10) + "T12:00:00"),
      };
    }),
  );

  return rss({
    title: "PolyWolf On Security",
    description:
      "reposts of various cybersecurity-themed news that i find interesting",
    site: new URL("/cybersec/", SITE_URL).toString(),
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
