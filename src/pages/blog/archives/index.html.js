import { css, html } from "../../../../lib/html.js";
import { Post } from "../../../components/blog/Post.js";
import { listBlogPagesByYear } from "../../../content/config.js";
import { toArchiveUrl } from "../../../urls.js";

const pagesByYear = await listBlogPagesByYear();
const rssLink = `/blog/rss.xml`;

export default await Post({
  pathname: "/archives/",
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/",
  rssLink,
  title: "Archives",
  description: "A list of the years in which I've blogged",
})(
  html`
<div class="info">
  <h1 class="p-name">Archives</h1>
</div>
<article class="e-content">
  <p>Here are all the years in which I've blogged!</p>
  <p>You can also explore the list of posts by <a href="/tags/">tag</a>.</p>
  <p>
    <ul>${pagesByYear.map(({ year }) => html`<li><a href="${toArchiveUrl(year)}">${year}</a></li>`)}</ul>
  </p>
</article>
`.withStyle(css`
    #rss {
      display: flex;
    }
    #rss svg {
      height: 1em;
    }
  `),
);
