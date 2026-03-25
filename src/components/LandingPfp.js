import { run_task } from "driver";
import { toArtUrl } from "../data/urls.js";
import { css, html } from "../render.js";

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
 * @returns {Promise<import("../render.js").HTML>}
 */
export const LandingPfp = async ({ src, dims, alt, title, desc }) => {
  const url = toArtUrl(src);
  let width = 256;
  let height = 256;
  if (dims) {
    ({ width: width, height: height } = dims);
  }

  const remoteImage = await run_task("src/runtime/remoteImage.js", {
    url,
    alt,
    title,
    loading: "eager",
    width,
    height,
  });

  return html`
    <figure>
      <div>
        <a href="/about/">${remoteImage}</a>
      </div>
      <figcaption>${desc}</figcaption>
    </figure>
  `.withStyle(css`
    figure {
      width: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    figure div {
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
