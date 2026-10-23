import { list_directory } from "driver";
import { inputPathToOutputPath } from "../build/config.js";
import { frontmatter } from "../runtime/index.js";

/**
 * @typedef {object} Props
 * @property {RegExp} pattern - Only filenames with this pattern will be returned
 * @property {string} base - The flat directory of files to list
 * @property {import("./types.js").Validator<Record<string, any>>} schema - The schema to validate the frontmatter with.
 *
 * @callback Loader
 * @returns {Promise<Record<string, import("../runtime/types.js").Page>>}
 */

/**
 * @param {Props} props
 * @returns {Loader}
 */
export const glob =
  ({ pattern, base, schema }) =>
  async () => {
    const filenames = await list_directory(base);
    /** @type {Array<[string, string]>} */
    const filesWithSlug = filenames.flatMap((filename) => {
      const match = pattern.exec(filename);
      if (!match || !match[1]) return [];
      const slug = match[1].toLowerCase();
      return [[filename, slug]];
    });
    /** @type {Record<string, import("../runtime/types.js").Page>} */
    const output = {};
    await Promise.all(
      filesWithSlug.map(async ([filename, slug]) => {
        const { frontmatter: orig, ...rest } = await frontmatter(filename);
        const { outputPath } = inputPathToOutputPath(rest.inputPath);
        output[filename] = {
          ...rest,
          frontmatter: schema(orig),
          outputPath,
          slug,
        };
      }),
    );
    return output;
  };
