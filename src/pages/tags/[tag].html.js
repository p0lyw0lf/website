import { read_file, run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { PostLink } from "../../components/blog/PostLink.js";
import { toTagUrl } from "../../data/urls.js";
import { css, html } from "../../render.js";

const getTags = async () => {
  const pages = await run_js("src/pages/blog/[slug].html.js", null);

  const byTag = new Map();
  for (const page of pages) {
    for (const tag of page.frontmatter.tags) {
      const existing = byTag.get(tag) ?? [];
      existing.push(page);
      byTag.set(tag, existing);
    }
  }

  return [...byTag.entries()].map(([tag, pages]) => ({
    tag,
    pages,
  }));
};

const buildTagPage = async ({ tag, pages }) => {
  const url = toTagUrl(tag);
  const rssLink = `/tags/${tag}/rss.xml`;
  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    rssLink,
    title: `#${tag}`,
    description: `All my blog posts tagged with #${tag}`,
  })(
    html`
      <span style="display: inline-flex; align-items: center; gap: 1rem;">
        <h1>#${tag}</h1>
        <a href="/tags/">All Tags</a>
        <a href="${rssLink}" id="rss">${await read_file("public/rss.svg")}</a>
      </span>
      <ul>
        ${pages.map(
          (page) =>
            html`<li
              >${PostLink({
                title: page.frontmatter.title,
                published: page.frontmatter.published,
                tags: page.frontmatter.tags,
                slug: page.slug,
              })}</li
            >`,
        )}
      </ul>
    `.withStyle(css`
      #rss {
        display: flex;
      }
      #rss svg {
        height: 1em;
      }
    `),
  );
};

export default ARG ? await buildTagPage(ARG) : await getTags();
