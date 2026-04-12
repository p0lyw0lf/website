import { toBlogUrl } from "../../data/urls.js";
import { css, html } from "../../render.js";
import { TagLink } from "./TagLink.js";

/**
 * @typedef {object} Props
 * @property {string} title
 * @property {number} published - seconds since unix epoch
 * @property {string[]} tags
 * @property {string} slug
 */

export const PostLink = ({ title, published: propsPublished, tags, slug }) => {
  const url = toBlogUrl(slug);
  const published = Temporal.Instant.fromEpochMilliseconds(
    propsPublished * 1000,
  );
  const publishedFormatted = published.toString().split("T")[0];

  return html`
    ${publishedFormatted}: <a href="${url}">${title}</a>
    ${tags.length > 0 &&
    html`<small>${tags.map((tag) => `${TagLink({ tag })} `)}</small>`}
  `.withStyle(css`
    small a {
      color: var(--color-text-secondary-accent);
    }
  `);
};
