import { run_task } from "driver";
import { TagLink } from "../../components/blog/TagLink.js";
import { html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const tags = await run_task("src/pages/tags/[tag].html.js", null);
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
  <h1>Tags</h1>
  <ul>
    ${sortedTags.map(
      ({ tag, pages }) => html`<li>${TagLink({ tag })} (${pages.length})</li>`,
    )}
  </ul>
`);
