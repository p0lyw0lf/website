import { store } from "driver";
import { Image } from "../../../lib/components/index.js";
import { attributes, html } from "../../../lib/html.js";
import { parseImage } from "../../../lib/runtime/image/index.js";

/**
 * @typedef {import("../../../lib/runtime/image/types").ConvertOpts} ConvertOpts
 *
 * @typedef {object} Props
 * @property {import("driver").StoreObject} src - Original src of the media to load
 * @property {string} url - Original URL of the image to load
 * @property {string} alt - Alt text, also shown on click into the image.
 * @property {string} title - Text that shows on hover/long-press.
 */

/** @type {Props} */
const { src, url, alt, title } = ARG;

const image = await parseImage(src);

/** @type {ConvertOpts} */
const defaultOpts = {
  format: "jxl",
  encoderOptions: { quality: 92, stripMetadata: true },
};
/** @type {ConvertOpts[]} */
const otherOpts = [384, 768, 1536]
  .filter((width) => width < image.size.width)
  .map((width) => ({
    ...defaultOpts,
    size: { width, height: 1 },
    fit: "cover",
    resizeMethod: "Lanczos",
  }));

const img = await Image({
  src,
  url,
  alt,
  title,
  defaultOpts,
  otherOpts,
});

// TODO: do we need to escape this any?
const id = url;

// NOTE: the CSS for this _needs_ to be stored out-of-line, because the markdown eventually gets
// passed beyond the serialization boundary. I should fix this...
export default store(
  html`
    <button class="show" popovertarget="${id}">${img}</button>
    <dialog popover id="${id}">
      <button class="hide" popovertarget="${id}" popovertargetaction="hide"
        >← Back</button
      >
      <figure>
        <img ${attributes({ src: url, alt, title })} />
        ${!!alt && html`<figcaption>${alt}</figcaption>`}
      </figure>
    </dialog>
  `.toString(),
);
