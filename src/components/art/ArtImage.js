import { run_task } from "driver";
import { BREAKPOINT_DESKTOP } from "../../css/breakpoints.js";
import { toArtUrl } from "../../data/urls.js";
import { css, html } from "../../render.js";

export const ArtImage = async ({ post, hidden }) => {
  const { src, alt, title, tags, published: rawPublished } = post.frontmatter;
  const url = toArtUrl(src);
  const published = Temporal.Instant.fromEpochMilliseconds(rawPublished * 1000);
  const formattedPublished = published.toString();

  return html`
    <button class="show" popovertarget="${src}">
      <p>${formattedPublished}</p>
      ${hidden
        ? html`<p>${alt}</p>`
        : await run_task("src/runtime/remoteImage.js", {
            url,
            alt,
            title,
            width: 256,
            height: 256,
          })}
      <p class="tags">${tags.map((tag) => html`<span>#${tag}</span> `)}</p>
    </button>
    <dialog popover id="${src}">
      <button class="hide" popovertarget="${src}" popovertargetaction="hide"
        >← Back</button
      >
      ${await run_task("src/runtime/artMarkdown.js", post.body)}
      <img src="${url}" alt="${alt}" title="${title}" />
    </dialog>
  `.withStyle(css`
    button {
      font-family: inherit;
      font-size: inherit;
    }
    .show {
      background: var(--color-background-secondary);
      border: var(--color-border-primary) solid var(--dim-border);
      color: var(--color-text-secondary);
      display: grid;
      grid-template-rows: auto 1fr auto;
      justify-items: center;
      row-gap: 8px;
      padding: 8px;
    }
    .tags {
      color: var(--color-text-secondary-accent);
    }

    dialog {
      background: var(--color-background-secondary);
      color: var(--color-text-secondary);
      padding: 16px;
      width: calc(100dvw - 32px);
      height: 100dvh;
    }

    @media (min-width: ${BREAKPOINT_DESKTOP}) {
      dialog {
        max-width: min(90dvw - 32px, 768px);
        max-height: 90dvh;
        border: var(--color-text-secondary-accent) solid 2px;
      }
    }
    dialog > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .hide {
      background: none;
      color: var(--color-text-secondary);
      border: var(--color-text-secondary-accent) solid var(--dim-border);
      padding: 4px 8px;
      margin-top: 8px;
    }
  `);
};
