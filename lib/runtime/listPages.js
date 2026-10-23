import { file_type, list_directory } from "driver";
import { inputPathToOutputPath } from "../build/config.js";
import { basename } from "../path.js";
import { frontmatter } from "./index.js";

/** @typedef {string} Props - Directeory of the markdown pages you want to recursively list. */
/** @type {Props} */
const dir = ARG;

const entries = await list_directory(dir);
const filenames = (
  await Promise.all(
    entries.map(async (entry) => {
      if (basename(entry).startsWith("_")) {
        return [];
      }

      const type = await file_type(entry);
      if (
        type === "file" &&
        entry.endsWith(".md") &&
        !entry.endsWith("/index.md")
      ) {
        return [entry];
      }
      // Look for subdirectories that have an "index.md" file in them
      if (type === "dir") {
        return (await list_directory(entry)).filter((subEntry) =>
          subEntry.endsWith("/index.md"),
        );
      }
      return [];
    }),
  )
).flat();

const pages = await Promise.all(
  filenames.map(async (filename) => {
    const { outputPath } = inputPathToOutputPath(filename);
    const page = await frontmatter(filename);
    return { ...page, outputPath };
  }),
);

/** @type {Array<import("./types.js").Page>} */
export default pages;
