import { run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { TagLink } from "../../components/blog/TagLink.js";
import { html } from "../../render.js";

const tags = await run_js("src/pages/tags/[tag].html.js", null);
const sortedTags = tags.sort(
  ({ tag: tagA, pages: pagesA }, { tag: tagB, pages: pagesB }) => {
    const byNumPages = pagesB.length - pagesA.length;
    if (byNumPages) return byNumPages;
    const byTagName = tagA.localeCompare(tagB);
    return byTagName;
  },
);

export default await Post({
  pathname: "/tags/",
  homeLink: "/blog/",
  sectionTitle: "PolyWolf's Blog",
  title: "Tags",
  description:
    "A list of all tags on my site, which lead you to blog posts tagged with those tags!",
})(html`
<div class="info">
  <h1 class="p-name">Tags</h1>
</div>
<article class="e-content">
  <p>Here are all my posts, organized by tag! The (number) represents how many posts are in that tag.</p>
  <p>You can also explore the list of posts by <a href="/blog/archives/">year</a>.</p>
  <p>
    <ul>
      ${sortedTags.map(
        ({ tag, pages }) =>
          html`<li>${TagLink({ tag })} (${pages.length})</li>`,
      )}
    </ul>
  </p>
</article>
`);
