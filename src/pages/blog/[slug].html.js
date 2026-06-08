import { run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { TagLink } from "../../components/blog/TagLink.js";
import { blog } from "../../content/config.js";
import { atprotoPostUrl, toBlogUrl } from "../../data/urls.js";
import { html } from "../../render.js";

const getPages = async () => {
  return Object.values(await blog()).sort(
    (a, b) => b.frontmatter.published - a.frontmatter.published,
  );
};

const buildPage = async ({ frontmatter, body, slug, isDraft }) => {
  const { title, description, mastodon, bluesky, tags } = frontmatter;
  const blueskyUrl = atprotoPostUrl(bluesky);
  const epochPublished = Temporal.Instant.fromEpochMilliseconds(
    frontmatter.published * 1000,
  );
  const published = epochPublished.toZonedDateTimeISO("America/New_York");
  const url = toBlogUrl(slug);

  // TODO: other h-entry properties: https://microformats.org/wiki/h-entry#Core_Properties

  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    title,
    description,
    isDraft,
  })(
    html`
      <div class="info">
        <h1 class="p-name">${title}</h1>
        <span
          >Published
          <time class="dt-published" datetime="${epochPublished.toString()}"
            >on ${published.toPlainDate().toLocaleString()} at
            ${published.toPlainTime().toLocaleString()}</time
          ></span
        >
      </div>
      <article class="e-content"
        >${await run_js("src/runtime/markdown.js", body)}</article
      >
      <div class="tags">${tags.map((tag) => TagLink({ tag }))}</div>
      ${(mastodon || blueskyUrl) &&
      html`
        <div class="comments">
          ${mastodon && html`<a href="${mastodon}">Comment on Mastodon</a>`}
          ${blueskyUrl && html`<a href="${blueskyUrl}">Comment on Bluesky</a>`}
        </div>
      `}
    `.withStyle(await run_js("./src/css/Blog.css.js")),
  );
};

export default ARG ? await buildPage(ARG) : await getPages();
