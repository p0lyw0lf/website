import { run_task } from "driver";
import { STATIC_URL } from "../data/urls.js";
import { html } from "../render.js";

/**
 * @typedef Props
 * @type {object}
 * @property {string} src - Relative to https://static.wolfgirl.dev/pfps/
 * @property {string} alt - Alt text for the image.
 */

/**
 * @param {Props} props
 * @returns {Promise<import("../render.js").HTML>}
 */
export const HeaderPfp = async ({ src, alt }) => {
  const remoteImage = await run_task("src/runtime/remoteImage.js", {
    url: `${STATIC_URL}/pfps/${src}`,
    width: 128,
    height: 128,
    widths: [128, 256],
    loading: "eager",
    alt,
  });
  return html`<a href="/art/">${remoteImage}</a>`;
};
