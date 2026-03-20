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
 * @callback Loader
 * @returns {Promise<Record<string, File>>}
 */

/**
 * @param {Props} props
 * @returns {Loader}
 */
export const glob =
  ({ pattern, base, schema }) =>
  async () => {
    const filenames = await list_directory(base);
    const filesWithSlug = filenames.flatMap((filename) => {
      const match = pattern.exec(filename);
      if (!match || !match[1]) return [];
      const slug = match[1];
      return [[filename, slug]];
    });
    const output = {};
    await Promise.all(
      filesWithSlug.map(async ([filename, slug]) => {
        const { frontmatter, body } = await run_task(
          "./src/runtime/frontmatter.js",
          filename,
        );
        output[filename] = { frontmatter: schema(frontmatter), body, slug };
      }),
    );
    return output;
  };
