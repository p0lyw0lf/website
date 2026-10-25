import { read_file } from "driver";
import { css, html } from "../../../lib/html.js";
import { Post } from "../../components/blog/Post.js";
import { PostLink } from "../../components/blog/PostLink.js";
import { listBlogPages } from "../../content/config.js";
import { toTagUrl } from "../../urls.js";

/**
 * @typedef {import("../../content/types").BlogPage} BlogPage
 *
 * @typedef {object} Props
 * @property {string} tag
 * @property {BlogPage[]} pages
 */

/** @returns {Promise<Props[]>} */
const list = async () => {
  const pages = await listBlogPages();

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

/**
 * @param {Props} props
 * @returns {Promise<import("driver").StoreObject>}
 */
const build = async ({ tag, pages }) => {
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
      <div class="info">
        <h1>#${tag}</h1>
        <span style="display: inline-flex; align-items: center; gap: 1rem;">
          <a href="/tags/">All Tags</a>
          <a href="${rssLink}" id="rss"
            >${await read_file("public/svg/rss.svg")}</a
          >
        </span>
      </div>
      <ul>
        ${await Promise.all(
          pages.map(
            async (page) =>
              html`<li
                >${await PostLink({
                  title: page.frontmatter.title,
                  published: page.frontmatter.published,
                  tags: page.frontmatter.tags,
                  slug: page.slug,
                })}</li
              >`,
          ),
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

/** @type {Props | null} */
const page = ARG;
export default page ? await build(page) : await list();
