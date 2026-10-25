import { get_url } from "driver";
import { Image } from "../../lib/components/index.js";
import { css, html } from "../../lib/html.js";
import { toArtUrl } from "../urls.js";

/**
 * @typedef {object} Dims
 * @property {number} width
 * @property {number} height
 *
 * @typedef {object} Props
 * @property {string} src - URL relative to https://static.wolfgirl.dev/art/
 * @property {Dims=} dims - Optional dimenson override (defaults to max 256/256 in both directions)
 * @property {string} alt
 * @property {string=} title
 * @property {string} desc
 */

/**
 * @param {Props} props
 * @returns {Promise<import("../../lib/html_types").HTML>}
 */
export const LandingPfp = async ({ src, dims, alt, title, desc }) => {
  const url = toArtUrl(src);
  let size = dims ?? { width: 256, height: 256 };

  const img = await Image({
    src: await get_url(url),
    url,
    alt,
    title,
    loading: "eager",
    defaultOpts: {
      format: "jpeg",
      encoderOptions: { quality: 90 },
      size,
      fit: "contain",
      resizeMethod: "Lanczos",
    },
    otherOpts: [],
  });

  return html`
    <figure class="landingPfp">
      <div>
        <a href="/about/">${img}</a>
      </div>
      <figcaption>${desc}</figcaption>
    </figure>
  `.withStyle(css`
    figure.landingPfp {
      width: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    figure.landingPfp div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      flex-wrap: wrap;
      gap: 1em;
      margin: 1em 0;
    }
  `);
};
