import { list_directory, run_task } from "driver";

/**
 * @typedef {object} Props
 * @property {RegExp} pattern - Only filenames with this pattern will be returned
 * @property {string} base - The flat directory of files to list
 * @property {import("./z.js").Validator} schema - The schema to validate the frontmatter with.
 *
 * @typedef {object} File - The output of parsing & validating a file's frontmatter
 * @property {unknown} frontmatter - The parsed frontmatter
 * @property {import("driver").StoreObject} body - The body that was read in
 *
 * @callback FileLoader
 * @returns {Promise<File>}
 *
 * @callback DirectoryLoader
 * @returns {Promise<Record<string, FileLoader>>}
 */

/**
 * @param {Props} props
 * @returns {DirectoryLoader}
 */
export const glob =
  ({ pattern, base, schema }) =>
  async () => {
    const files = await list_directory(base);
    const output = {};
    for (const file of files) {
      const match = pattern.exec(file);
      if (!match || !match[1]) continue;
      const slug = match[1];
      output[file] = async () => {
        const { frontmatter, body } = await run_task(
          "./src/runtime/frontmatter.js",
          file,
        );
        return { frontmatter: schema(frontmatter), body, slug };
      };
    }
    return output;
  };
