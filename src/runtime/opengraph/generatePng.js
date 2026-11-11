import { read_file, run_command } from "driver";
import { parseImage } from "../../../lib/runtime/image/index.js";

/**
 * @typedef {object} Props
 * @property {string} title
 * @property {string[]} tags
 */

/** @type {Props} */
const { title, tags } = ARG;

const png = await run_command(
  [
    "typst",
    "compile",
    "INPUT",
    "-",
    "--format",
    "png",
    "--ppi",
    "72",
    "--input",
    `title=${title}`,
    "--input",
    `tags=${tags.map((tag) => "#" + tag).join(" ")}`,
  ],
  await read_file("src/runtime/opengraph/opengraph.typ"),
);
export default await parseImage(png);
