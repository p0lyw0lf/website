import { get_url } from "driver";
import { Image } from "../../lib/components/index.js";
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
  const url = `${STATIC_URL}/pfps/${src}`;

  /**
   * @param {number} dim
   * @returns {import("../../lib/runtime/image/types").ConvertOpts}
   */
  const opts = (dim) => ({
    format: "webp",
    encoderOptions: { quality: 80 },
    size: { width: dim, height: dim },
    fit: "contain",
    resizeMethod: "Lanczos",
  });

  const img = await Image({
    src: await get_url(url),
    url,
    alt,
    defaultOpts: opts(128),
    otherOpts: [opts(256)],
  });

  return html`<a id="headerPfp" href="/art/">${img}</a>`.withStyle(css`
    #headerPfp {
      display: flex;
    }
    #headerPfp img {
      width: 128px;
      height: auto;
    }
  `);
};
