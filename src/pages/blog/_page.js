import { html } from "../../../lib/html.js";
import { markdownToHtml } from "../../../lib/runtime/index.js";
import { Post } from "../../components/blog/Post.js";
import { TagLink } from "../../components/blog/TagLink.js";
import BlogCss from "../../css/Blog.css.js";
import { inlineMarkdown } from "../../runtime/index.js";
import { atprotoPostUrl, toBlogUrl } from "../../urls.js";

/**
 * @typedef {import("../../content/types.js").BlogPage} Props
 */
/** @type {Props} */
const { frontmatter, body, slug, isDraft } = ARG;

const { title, description, mastodon, bluesky, tags } = frontmatter;
const blueskyUrl = atprotoPostUrl(bluesky);
const epochPublished = Temporal.Instant.fromEpochMilliseconds(
  frontmatter.published * 1000,
);
const published = epochPublished.toZonedDateTimeISO("America/New_York");
const url = toBlogUrl(slug);

// TODO: other h-entry properties: https://microformats.org/wiki/h-entry#Core_Properties

export default await Post({
  pathname: url,
  homeLink: "/blog/",
  sectionTitle: "PolyWolf's Blog",
  title,
  description,
  isDraft,
})(
  html`
    <div class="info">
      <h1 class="p-name">${await inlineMarkdown(title)}</h1>
      <span
        >Published
        <time class="dt-published" datetime="${epochPublished.toString()}"
          >on ${published.toPlainDate().toLocaleString()} at
          ${published.toPlainTime().toLocaleString()}</time
        ></span
      >
    </div>
    <article class="e-content">${await markdownToHtml(body)}</article>
    <div class="tags">${tags.map((tag) => TagLink({ tag }))}</div>
    ${
      (mastodon || blueskyUrl) &&
      html`
        <div class="comments">
          ${mastodon && html`<a href="${mastodon}">Comment on Mastodon</a>`}
          ${blueskyUrl && html`<a href="${blueskyUrl}">Comment on Bluesky</a>`}
        </div>
      `
    }
  `.withStyle(BlogCss),
);
