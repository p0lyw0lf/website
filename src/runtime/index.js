import { run_js } from "driver";

/** @param {import("./artMarkdown").Props} input */
export const artMarkdown = (input) =>
  /** @type {Promise<typeof import("./artMarkdown").default>} */ (
    run_js("src/runtime/artMarkdown.js", input)
  );

/** @param {import("./inlineMarkdown").Props} input */
export const inlineMarkdown = (input) =>
  /** @type {Promise<typeof import("./inlineMarkdown").default>} */ (
    run_js("src/runtime/inlineMarkdown.js", input)
  );
