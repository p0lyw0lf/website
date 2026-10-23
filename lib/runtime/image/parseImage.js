import { run_command } from "driver";

/**
 * @typedef {import("driver").StoreObject} Props
 */
/** @type {Props} */
const blob = ARG;

const output = await run_command(
  ["identify", "-ping", "-format", "%w %h %m", "INPUT"],
  blob,
);

const [width, height, format] = output.toString().split(" ");
if (!width || !height || !format) {
  throw new Error(`invalid imagemagick output: ${output.toString()}`);
}

/** @type {import("./types").Image} */
export default {
  object: blob,
  format: format.toLowerCase(),
  size: {
    width: parseInt(width),
    height: parseInt(height),
  },
};
