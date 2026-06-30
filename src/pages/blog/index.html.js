import { read_file, run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { PostLink } from "../../components/blog/PostLink.js";
import { SITE_URL } from "../../data/urls.js";
import { css, html } from "../../render.js";

const pages = await run_js("src/pages/blog/[slug].html.js", null);
const rssLink = `/blog/rss.xml`;

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
      ${await Promise.all(
        pages.slice(0, 10).map(
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
  </p>
  <p>You can explore past posts by <a href="/tags/">tag</a>, by <a href="/blog/archives/">year</a>, or in the <a
    href="${SITE_URL}${rssLink}"
    id="rss"
  >full-text RSS feed
  ${await read_file("public/svg/rss.svg")}</a
  ></p>
</article>
`.withStyle(css`
    #rss svg {
      height: 1em;
      margin-left: 0.25em;
    }
  `),
);
