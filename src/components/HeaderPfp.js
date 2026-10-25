import { run_js } from "driver";
import { css, html } from "../../lib/html.js";
import { STATIC_URL } from "../urls.js";

/**
 * @typedef Props
 * @type {object}
 * @property {string} src - Relative to https://static.wolfgirl.dev/pfps/
 * @property {string} alt - Alt text for the image.
 */

/**
 * @param {Props} props
 * @returns {Promise<import("../../lib/html_types").HTML>}
 */
export const HeaderPfp = async ({ src, alt }) => {
  const remoteImage = await run_js("src/runtime/remoteImage.js", {
    url: `${STATIC_URL}/pfps/${src}`,
    width: 128,
    height: 128,
    widths: [128, 256],
    loading: "eager",
    alt,
  });
  return html`<a id="headerPfp" href="/art/">${remoteImage}</a>`.withStyle(css`
    #headerPfp {
      display: flex;
    }
  `);
};
