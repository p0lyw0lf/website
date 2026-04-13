import {
  convert_image,
  get_url,
  minify_html,
  parse_image,
  store,
  write_output,
} from "driver";
import { toAssetUrl } from "../data/urls.js";
import { html } from "../render.js";

/**
 * Given a url, alt, and title text, converts the image to a safe version for inclusion later.
 */

const { url, alt, title, widths, width, height, loading } = ARG;

const object = await get_url(url);
const image = await parse_image(object);

// TODO: better way of specifying dimensions we want to resize to. For now this is probably fine tho.
const resizedImages = widths?.length
  ? await Promise.all(
      widths
        .filter((width) => width < image.size().width)
        .map(async (width) => {
          const resizedImage = await convert_image(image, {
            format: "webp",
            size: { width, height: image.size().height },
            fit: "contain",
          });
          return resizedImage;
        }),
    )
  : [];

const desiredWidth = width || image.size().width;
const desiredHeight = height || image.size().height;
const convertedImage = await convert_image(image, {
  format: "webp",
  size: { width: desiredWidth, height: desiredHeight },
  fit: "contain",
});
const { width: finalWidth, height: finalHeight } = convertedImage.size();

const primarySrc = toAssetUrl(convertedImage);
write_output(
  primarySrc.slice(1) /* slice off leading slash */,
  convertedImage.object(),
);

const srcSet = resizedImages.map((resizedImage) => {
  const src = toAssetUrl(resizedImage);
  write_output(src.slice(1), resizedImage.object());
  return `${src} ${resizedImage.size().width}w`;
});

export default await minify_html(
  store(
    html`<img
      src="${primarySrc}"
      width="${finalWidth}"
      height="${finalHeight}"
      ${!!alt && `alt=${JSON.stringify(alt)}`}
      ${!!loading && `loading=${JSON.stringify(loading)}`}
      ${!!title && `title=${JSON.stringify(title)}`}
      ${srcSet.length > 0 && `srcset="${srcSet.join(", ")}"`}
    />`.toString(),
  ),
);
