import { list_directory } from "driver";
import { inputPathToOutputPath } from "../build/config.js";
import { frontmatter } from "../runtime/index.js";

/**
 * @template Schema
 * @typedef {object} Props
 * @property {RegExp} pattern - Only filenames with this pattern will be returned
 * @property {string} base - The flat directory of files to list
 * @property {Schema} schema - The schema to validate the frontmatter with.
 */
/**
 * @template T
 * @callback Loader
 * @returns {Promise<Record<string, import("../runtime/types.js").Page<T>>>}
 */

/**
 * @template {import("./types.js").Validator<Record<string, any>>} Schema
 * @param {Props<Schema>} props
 * @returns {Loader<ReturnType<Schema>>}
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
    /** @type {Record<string, import("../runtime/types.js").Page<ReturnType<Schema>>>} */
    const output = {};
    await Promise.all(
      filesWithSlug.map(async ([filename, slug]) => {
        const { frontmatter: rawFrontmatter, ...rest } =
          await frontmatter(filename);
        /** @type {any} */
        const parsedFrontmatter = schema(rawFrontmatter);
        const { outputPath } = inputPathToOutputPath(rest.inputPath);
        output[filename] = {
          ...rest,
          frontmatter: parsedFrontmatter,
          outputPath,
          slug,
        };
      }),
    );
    return output;
  };
