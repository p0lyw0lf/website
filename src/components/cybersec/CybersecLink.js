import { toCybersecUrl } from "../../data/urls.js";
import { html } from "../../render.js";

/**
 * @typedef {object} Props
 * @property {string} slug
 * @property {string} title
 * @property {string} repost_link
 */

/**
 * @param {Props} props
 * @returns {import("../../render.js").HTML}
 */
export const CybersecLink = ({ slug, title, repost_link }) => html`
  ${slug.slice(0, 10)}: <a href="${toCybersecUrl(slug)}">${title}</a> (<a
    href="${repost_link}"
    >source</a
  >)
`;
