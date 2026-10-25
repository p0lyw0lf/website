import { html } from "../../../lib/html.js";
import { toCybersecUrl } from "../../data/urls.js";

/**
 * @typedef {object} Props
 * @property {string} slug
 * @property {string} title
 * @property {string} repost_link
 */

/**
 * @param {Props} props
 * @returns {import("../../../lib/html_types").HTML}
 */
export const CybersecLink = ({ slug, title, repost_link }) => html`
  ${slug.slice(0, 10)}: <a href="${toCybersecUrl(slug)}">${title}</a> (<a
    href="${repost_link}"
    >source</a
  >)
`;
