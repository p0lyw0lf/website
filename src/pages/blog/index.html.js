import { read_file, run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { PostLink } from "../../components/blog/PostLink.js";
import { SITE_URL } from "../../data/urls.js";
import { css, html } from "../../render.js";

const pages = await run_js("src/pages/blog/[slug].html.js", null);
const rssLink = `${SITE_URL}/blog/rss.xml`;

export default await Post({
  pathname: "/blog/",
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/",
  rssLink,
  title: "Blog",
  description: "The homepage for my blog",
})(
  html`
<div class="info">
  <h1 class="p-name">Blog</h1>
</div>
<article class="e-content">
  <p>I have a blog! There may be many blogs like it, but this one is mine!</p>
  <p>
    Some recent posts:
    <ul>
      ${pages.slice(0, 10).map(
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
  </p>
  <p>An archive of past posts is available via <a href="/tags/">tags</a>, or in the <a
    href="${rssLink}"
    id="rss"
  >full-text RSS feed
  ${await read_file("public/rss.svg")}</a
  ></p>
</article>
`.withStyle(css`
    #rss svg {
      height: 1em;
      margin-left: 0.25em;
    }
  `),
);
