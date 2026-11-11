import { read_file, run_command, run_js } from "driver";

/** @typedef {import("../../../content/types").BlogPage} Props */

const list = () =>
  /** @type {Promise<Props[]>} */ (
    run_js("src/pages/blog/[slug].html.js", null)
  );

/**
 * @param {Props} page
 * @returns {Promise<import("driver").StoreObject>}
 */
const build = async ({ frontmatter }) => {
  const { title, tags } = frontmatter;
  return await run_command(
    [
      "typst",
      "compile",
      "INPUT",
      "-",
      "--format",
      "png",
      "--ppi",
      "144",
      "--input",
      `title=${title}`,
      "--input",
      `tags=${tags.map((tag) => "#" + tag).join(" ")}`,
    ],
    await read_file("src/pages/blog/opengraph/opengraph.typ"),
  );
};

/** @type {Props | null} */
const page = ARG;
export default page ? await build(page) : await list();
