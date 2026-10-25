import { store } from "driver";
import { SITE_URL } from "../../CONFIG.js";
import { externalReplacementUrl } from "../data/urls.js";
import { attributes, html } from "../html.js";
import { basename } from "../path.js";
import { toAsset } from "../runtime/image/index.js";

/** @typedef {import("./Image_types").ImageProps} Props */
/** @type {Props} */
const { src, url, defaultOpts, otherOpts, ...attrs } = ARG;

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
      ...attrs,
      src: `${SITE_URL}/${defaultElem.path}`,
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
