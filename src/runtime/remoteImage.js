import {
  convert_image,
  get_url,
  parse_image,
  store,
  write_output,
} from "driver";

/**
 * Given a url, alt, and title text, converts the image to a safe version for inclusion later.
 */

const { url, alt, title, widths } = ARG;

const object = await get_url(url);
const image = await parse_image(object);

// TODO: better way of specifying dimensions we want to resize to. For now this is probably fine tho.
const resizedImages = await Promise.all(
  widths
    .filter((width) => width < image.size.width)
    .map(async (width) => {
      const resizedImage = await convert_image(image, {
        format: "webp",
        size: { width, height: image.height },
        fit: "contain",
      });
      return resizedImage;
    }),
);

for (const resizedImage of resizedImages) {
  write_output(
    `_assets/${resizedImage.object.hash}.${resizedImage.format}`,
    resizedImage.object,
  );
}

// TODO: finish this
export default store;
