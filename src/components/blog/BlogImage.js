import { minify_html, run_task, store } from "driver";
import { attributes, html } from "../../render.js";

/**
 * @typedef {object} Props
 * @property {string} url - Original URL of the image to load
 * @property {string} alt - Alt text, also shown on click into the image.
 * @property {string} title - Text that shows on hover/long-press.
 */

export const BlogImage = async ({ url, alt, title }) => {
  const img = await run_task("src/runtime/remoteImage.js", {
    url,
    alt,
    title,
    widths: [384, 768, 1536],
  });

  // TODO: do we need to escape this any?
  const id = url;

  // NOTE: the CSS for this _needs_ to be stored out-of-line, because the markdown eventually gets
  // passed beyond the serialization boundary. I should fix this...
  return await minify_html(
    store(
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
    ),
  );
};
