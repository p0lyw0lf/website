import { read_file, run_js } from "driver";
import { PostLink } from "../../components/blog/PostLink.js";
import { SITE_URL } from "../../data/urls.js";
import { css, html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const pages = await run_js("src/pages/blog/[slug].html.js", null);
const rssLink = `${SITE_URL}/blog/rss.xml`;

export default await Post({
  pathname: "/blog/",
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/blog/",
  title: "Blog",
  description: "The homepage for my blog",
})(
  html`
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
`.withStyle(css`
    #rss svg {
      height: 1em;
      margin-left: 0.25em;
    }
  `),
);
