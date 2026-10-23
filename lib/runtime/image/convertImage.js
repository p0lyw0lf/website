import { run_command } from "driver";
import { parseImage } from "./index.js";

/**
 * @typedef {object} Props
 * @property {import("./types.js").Image} image
 * @property {import("./types.js").ConvertOpts} opts
 */
/** @type {Props} */
const { image, opts } = ARG;

const command = ["magick", "INPUT"];

if (opts.resizeMethod) {
  command.push("-filter", opts.resizeMethod);
}

if (opts.size) {
  const { width: w, height: h } = opts.size;
  let geometry;
  switch (opts.fit) {
    case "fill":
      // strictly forced, original aspect ratio ignored
      geometry = `${w}x${h}!`;
      break;
    case "cover":
      // minimum values of width and height, preserving aspect ratio
      geometry = `${w}x${h}^`;
      break;
    case "contain":
    default:
      // maximum valuse of width and height, preserving aspect ratio
      geometry = `${w}x${h}`;
      break;
  }
  command.push("-resize", geometry);
}

if (opts.encoderOptions?.quality) {
  command.push("-quality", opts.encoderOptions.quality.toString());
}

const format = opts.format ?? image.format;

if (format === "jxl" && opts.encoderOptions?.effort) {
  command.push("-define", `jxl:effort=${opts.encoderOptions.effort}`);
}

if (opts.encoderOptions?.stripMetadata) {
  command.push("-strip");
}

command.push(`${format.toUpperCase()}:-`);
const output = await run_command(command, image.object);

// We don't have a great way to
// report the new image data
// out-of-line with the image
// object, so we need to re-parse.
//
// This also helps debugif
// ImageMagick fails to convert to a
// format for some reason.
export default await parseImage(output);
