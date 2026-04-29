import { run_task } from "driver";
import { PostLink } from "../../components/blog/PostLink.js";
import { toTagUrl } from "../../data/urls.js";
import { html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const getTags = async () => {
  const pages = await run_task("src/pages/blog/[slug].html.js", null);

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
  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    rssLink: `/tags/${tag}/rss.xml`,
    title: `#${tag}`,
    description: `All my blog posts tagged with #${tag}`,
  })(html`
    <span style="display: inline-flex; align-items: center; gap: 1rem;">
      <h1>#${tag}</h1>
      <a href="/tags/">All Tags</a>
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
  `);
};

export default ARG ? await buildTagPage(ARG) : await getTags();
