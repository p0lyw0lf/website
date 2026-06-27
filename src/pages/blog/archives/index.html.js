import { run_js } from "driver";
import { Post } from "../../../components/blog/Post.js";
import { toArchiveUrl } from "../../../data/urls.js";
import { css, html } from "../../../render.js";

const pagesByYear = await run_js(
  "src/pages/blog/archives/[year].html.js",
  null,
);
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
