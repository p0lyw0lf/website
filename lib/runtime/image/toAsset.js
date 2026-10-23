import { slugify, write_output } from "driver";
import { splitext } from "../../path.js";
import { convertImage, parseImage } from "./index.js";

/**
 * @typedef {object} Props
 * @property {import("driver").StoreObject} src - The image's binary object.
 * @property {string=} filename - The original filename of the image, if known.
 * @property {import("./types.js").ConvertOpts} opts - Options for how to transform the image
 */
const { src, filename, opts } = ARG;
const image = await parseImage(src);

/**
 * @param {import("./types.js").Image} image
 * @param {string=} filename
 * @returns {string}
 */
const toAssetPath = (image, filename) => {
  const hash = image.object.hash();
  let slug;
  if (filename) {
    const [base, _ext] = splitext(filename);
    slug = `${slugify(base)}-${hash.slice(-6)}`;
  } else {
    slug = hash.slice(-18);
  }
  return `_assets/${slug}.${image.format}`;
};

const convertedImage = await convertImage({ image, opts });
const path = toAssetPath(convertedImage, filename);
write_output(path, convertedImage.object);

/**
 * @typedef {object} ImageWithUrl
 * @property {import("./types.js").Image} image
 * @property {string} path - where this image has been output to, relative to the output directory
 */
/** @type {ImageWithUrl} */
export default { image: convertedImage, path };
