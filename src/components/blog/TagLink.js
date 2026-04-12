import { toTagUrl } from "../../data/urls.js";
import { html } from "../../render.js";

/**
 * @typedef {object} Props
 * @param {string} tag
 */

/**
 * @param {Props} props
 * @returns {import("../../render.js").HTML}
 */
export const TagLink = ({ tag }) => {
  return html`<a href="${toTagUrl(tag)}">#${tag}</a>`;
};
