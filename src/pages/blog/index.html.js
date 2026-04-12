import { run_task } from "driver";
import { PostLink } from "../../components/blog/PostLink.js";
import { html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const pages = await run_task("src/pages/blog/[slug].html.js", null);

export default await Post({
  pathname: "/blog/",
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/blog/",
  title: "Blog",
  description: "The homepage for my blog",
})(html`
  <p>I have a blog! There may be many blogs like it, but this one is mine!</p>
  <p>
    Some recent posts:
    <ul>
      ${pages
        .slice(-10)
        .reverse()
        .map(
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
  <p>You can find an archive of all past posts via browsing the list of <a href="/tags/">tags</a>.</p>
`);
