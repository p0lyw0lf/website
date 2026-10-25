import { list_directory } from "driver";
import { frontmatter } from "../runtime/index.js";

/**
 * @template Schema
 * @typedef {object} Props
 * @property {RegExp} pattern - Only filenames with this pattern will be returned
 * @property {string} base - The flat directory of files to list
 * @property {import("./types").Validator<Schema>} schema - The schema to validate the frontmatter with.
 * @property {(slug: string) => string} toOutputPath - How to turn the slug into where the
 */

/**
 * @template {Record<string, any>} Schema
 * @param {Props<Schema>} props
 * @returns {import("./types").Collection<Schema>}
 */
export const glob = ({ pattern, base, schema, toOutputPath }) => {
  /** @param {string} filename */
  const process = async (filename) => {
    const match = pattern.exec(filename);

    if (!match || !match[1]) return undefined;
    const slug = match[1].toLowerCase();

    const { frontmatter: rawFrontmatter, ...rest } =
      await frontmatter(filename);
    /** @type {any} */
    const parsedFrontmatter = schema(rawFrontmatter);
    return {
      ...rest,
      frontmatter: parsedFrontmatter,
      outputPath: toOutputPath(slug),
      slug,
    };
  };
  return {
    base,
    schema,
    single: (file) => process(`${base}/${file}`),
    all: async () => {
      const filenames = await list_directory(base);
      const output = await Promise.all(filenames.map(process));
      return output.filter((page) => page !== undefined);
    },
  };
};
