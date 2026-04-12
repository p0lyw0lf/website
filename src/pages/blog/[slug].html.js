import { run_task } from "driver";
import { TagLink } from "../../components/blog/TagLink.js";
import { blog } from "../../content/config.js";
import { BREAKPOINT_IPAD } from "../../css/breakpoints.js";
import { atprotoPostUrl, toBlogUrl } from "../../data/urls.js";
import { css, html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const getPages = async () => {
  return Object.values(await blog()).sort(
    (a, b) => a.frontmatter.published - b.frontmatter.published,
  );
};

const buildPage = async ({ frontmatter, body, slug }) => {
  const { title, description, mastodon, bluesky, tags } = frontmatter;
  const blueskyUrl = atprotoPostUrl(bluesky);
  const published = Temporal.Instant.fromEpochMilliseconds(
    frontmatter.published * 1000,
  );
  const url = toBlogUrl(slug);

  // TODO: other h-entry properties: https://microformats.org/wiki/h-entry#Core_Properties

  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    title,
    description,
  })(
    html`
      <div class="info">
        <h1 class="p-name">${title}</h1>
        <span
          >Published:
          <time class="dt-published" datetime="${published.toString()}"
            >${published.toLocaleString("en-US", {
              timeZone: "America/New_York",
            })}</time
          >
        </span>
      </div>
      <article class="e-content"
        >${await run_task("src/runtime/markdown.js", body)}</article
      >
      <div class="tags">${tags.map((tag) => TagLink({ tag }))}</div>
      ${(mastodon || blueskyUrl) &&
      html`
        <div class="comments">
          ${mastodon && html`<a href="${mastodon}">Comment on Mastodon</a>`}
          ${blueskyUrl && html`<a href="${blueskyUrl}">Comment on Bluesky</a>`}
        </div>
      `}
    `.withStyle(css`
      main {
        padding: 0 !important;
      }

      .info,
      .tags {
        background-color: var(--color-background-secondary);
        color: var(--color-text-secondary);

        padding: 16px;

        border-top: solid var(--dim-border) var(--color-border-primary);
        border-bottom: solid var(--dim-border) var(--color-border-primary);
      }

      .tags:not(:last-child) {
        border-bottom: none;
      }

      .comments {
        padding: 16px;

        border-top: solid var(--dim-border) var(--color-border-primary);
        border-bottom: solid var(--dim-border) var(--color-border-primary);
      }

      .info h1 {
        margin: 0 0 8px;
      }

      article {
        padding: 0 16px;
      }

      .tags,
      .comments {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      @media (min-width: ${BREAKPOINT_IPAD}) {
        .info {
          border-top: none;
        }
        .tags,
        .comments {
          border-bottom: none;
        }
      }
    `),
  );
};

export default ARG ? await buildPage(ARG) : await getPages();
