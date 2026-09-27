import { list_directory, run_js } from "driver";

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
export const glob = ({ pattern, base, schema }) => ({
  all: async () => {
    const filenames = await list_directory(base);
    const filesWithSlug = filenames.flatMap((filename) => {
      const match = pattern.exec(filename);
      if (!match || !match[1]) return [];
      // TODO: this should probably be `slugify`, but I can't change it now...
      const slug = match[1].toLowerCase();
      return [[filename, slug]];
    });
    const output = {};
    await Promise.all(
      filesWithSlug.map(async ([filename, slug]) => {
        const { frontmatter, body } = await run_js(
          "src/runtime/frontmatter.js",
          filename,
        );
        output[filename] = { frontmatter: schema(frontmatter), body, slug };
      }),
    );
    return output;
  },
  single: async (file) => {
    // TODO: unify this with the above better
    const filename = `${base}/${file}`;
    const match = pattern.exec(filename);
    if (!match || !match[1]) return;
    const slug = match[1].toLowerCase();

    const { frontmatter, body } = await run_js(
      "src/runtime/frontmatter.js",
      filename,
    );
    return { frontmatter: schema(frontmatter), body, slug };
  },
});
