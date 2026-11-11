import { run_js, write_output } from "driver";
import { SITE_URL } from "../../../CONFIG.js";
import { html } from "../../../lib/html.js";

/** @param {import("./generatePng").Props} props */
export const generateOpengraphPng = (props) =>
  /** @type {Promise<typeof import("./generatePng").default>} */ (
    run_js("src/runtime/opengraph/generatePng.js", props)
  );

/**
 * @param {import("../../../lib/runtime/image/types").Image} image
 * @param {string} url
 * @returns {import("../../../lib/html_types").HTML}
 */
export const ogMeta = (image, url) => {
  // NOTE: this assumes url is relative to SITE_URL.
  write_output(url.slice(SITE_URL.length + 1), image.object);
  return html`
    <meta property="og:image" content="${url}" />
    <meta property="og:image:type" content="image/${image.format}" />
    <meta property="og:image:width" content="${image.size.width}" />
    <meta property="og:image:height" content="${image.size.height}" />
  `;
};
