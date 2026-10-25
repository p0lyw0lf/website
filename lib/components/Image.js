import { store } from "driver";
import { SITE_URL } from "../../CONFIG.js";
import { externalReplacementUrl } from "../data/urls.js";
import { attributes, html } from "../html.js";
import { basename } from "../path.js";
import { toAsset } from "../runtime/image/index.js";

/**
 * @typedef {import("../runtime/image/types.js").ConvertOpts} ConvertOpts
 *
 * @typedef {object} Props
 * @property {import("driver").StoreObject} src - Original src of the media to load
 * @property {string} url - Original output filename of the media to load
 * @property {string=} alt - Alt text, also shown on click into the image.
 * @property {string=} title - Text that shows on hover/long-press.
 * @property {ConvertOpts | undefined} defaultOpts - Options for how to transform the main image shown
 * @property {Array<ConvertOpts> | undefined} otherOpts - Options for how to transform other images shown in the `<picture>` element.
 */

/** @type {Props} */
const { src, url, alt, title, defaultOpts, otherOpts } = ARG;

let output;
const externalUrl = externalReplacementUrl(url);
if (externalUrl) {
  output = html`<img src="${externalUrl}" />`;
} else {
  const filename = basename(url);

  const [defaultElem, ...otherElems] = await Promise.all([
    toAsset({
      src,
      filename,
      opts: defaultOpts ?? {
        format: "jpeg",
        encoderOptions: { quality: 92 },
      },
    }),
    ...(otherOpts?.map((opts) => toAsset({ src, filename, opts })) ?? []),
  ]);

  const defaultImg = html`<img
    ${attributes({
      src: `${SITE_URL}/${defaultElem.path}`,
      alt: alt || undefined,
      title: title || undefined,
    })}
  />`;

  const otherSources = otherElems.map(
    (elem) =>
      html`<source
        ${attributes({
          srcset: `${SITE_URL}/${elem.path}`,
          type: `image/${elem.image.format}`,
        })}
      />`,
  );

  output = otherSources.length
    ? html`<picture>${otherSources}${defaultImg}</picture>`
    : defaultImg;
}

// If you want to add any wrappers around the image, do it here, by re-assigning to `output`.
export default store(output.toString());
