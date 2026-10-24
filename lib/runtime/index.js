import { run_command, run_js } from "driver";

/** @param {import("./frontmatter").Props} path */
export const frontmatter = (path) =>
  /** @type {Promise<typeof import("./frontmatter").default>} */ (
    run_js("lib/runtime/frontmatter.js", path)
  );

/** @param {import("./listPages").Props} dir */
export const listPages = (dir) =>
  /** @type {Promise<typeof import("./listPages").default>} */ (
    run_js("lib/runtime/listPages.js", dir)
  );

/** @param {import("driver").StoreObject} input */
export const minifyHtml = (input) =>
  run_command(
    [
      "minhtml",
      "--keep-closing-tags",
      "--keep-comments",
      "--keep-html-and-head-opening-tags",
      "--minify-css",
      "--minify-js",
    ],
    input,
  );

/** @param {import("driver").StoreObject} input */
export const plainMarkdownToHtml = (input) =>
  run_command(["driver-comrak", "INPUT"], input);

/** @param {import("./markdown").Props} input */
export const markdownToHtml = (input) =>
  /** @type {Promise<typeof import("./markdown").default>} */ (
    run_js("lib/runtime/markdown.js", input)
  );

/** @param {import("./runTemplate").Props} props */
export const runTemplate = (props) =>
  /** @type {Promise<typeof import("./runTemplate").default>} */ (
    run_js("lib/runtime/runTemplate.js", props)
  );
