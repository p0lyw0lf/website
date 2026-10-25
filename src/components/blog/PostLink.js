import { toShortISODate } from "../../../lib/data/date.js";
import { css, html } from "../../../lib/html.js";
import { inlineMarkdown } from "../../runtime/index.js";
import { toBlogUrl } from "../../urls.js";
import { TagLink } from "./TagLink.js";

/**
 * @typedef {object} Props
 * @property {string} title
 * @property {number} published - seconds since unix epoch
 * @property {string[]} tags
 * @property {string} slug
 */

/**
 * @param {Props} props
 * @returns {Promise<import("../../../lib/html_types").HTML>}
 */
export const PostLink = async ({
  title,
  published: propsPublished,
  tags,
  slug,
}) => {
  const url = toBlogUrl(slug);
  const published = Temporal.Instant.fromEpochMilliseconds(
    propsPublished * 1000,
  );
  const formattedPublished = toShortISODate(published);

  return html`
    ${formattedPublished}:
    <a href="${url}">${await inlineMarkdown(title)}</a>
    ${
      tags.length > 0 &&
      html`<small class="tags"
        >${tags.map((tag) => `${TagLink({ tag })} `)}</small
      >`
    }
  `.withStyle(css`
    small.tags a {
      color: var(--color-text-secondary-accent);
    }
  `);
};
