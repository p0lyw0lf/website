import { html } from "../../../lib/html.js";
import { toTagUrl } from "../../urls.js";

/**
 * @typedef {object} Props
 * @property {string} tag
 */

/**
 * @param {Props} props
 * @returns {import("../../../lib/html_types").HTML}
 */
export const TagLink = ({ tag }) => {
  return html`<a href="${toTagUrl(tag)}">#${tag}</a>`;
};
