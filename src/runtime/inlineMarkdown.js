import { store } from "driver";
import { plainMarkdownToHtml } from "../../lib/runtime/index.js";

/**
 * Renders a string as "inline markdown", that is, without the outer `<p></p>` tags.
 *
 * Intended only for single-line strings that will be used in titles.
 */

/**
 * @typedef {string} Props
 */
/** @type {Props} */
const input = ARG;

const output = await plainMarkdownToHtml(store(input));
// Strip leading <p> (3) and trailing </p> (4)
export default output.toString().trim().slice(3, -4);
