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
 * @returns {string}
 */
export const LandingPfp = ({ src, dims, alt, title, desc }) => {
  const url = toArtUrl(src);
  let width = 256;
  let height = 256;
  if (dims) {
    ({ width: width, height: height } = dims);
  }

  // TODO: find a way of getting the remote width and height of an image
  // Need to have custom way of shrinking image to fit inside both of these bounds, while preserving aspect ratio
  // width = Math.min(width, (remoteWidth * height) / remoteHeight);
  // height = Math.min(height, (remoteHeight * width) / remoteWidth);

  return html`
    <figure>
      <div>
        <a href="${url}">
          <image
            src="${url}"
            width="${width}"
            height="${height}"
            alt="${alt}"
            title="${title}"
            loading="eager"
          />
        </a>
      </div>
      <figcaption> ${desc} </figcaption>
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
