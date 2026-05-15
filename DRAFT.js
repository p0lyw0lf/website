import { minify_html, read_file, run_task, write_output } from "driver";

if (!Array.isArray(ARG)) {
  throw new Error("unexpected: ARG is not an array");
}

const filename = ARG[0];
if (typeof filename !== "string") {
  throw new Error("unexpected: ARG[0] is not a string");
}

// Bare minimum pipeline adapted from ./BUILD.js
const input = await read_file(`drafts/src/${filename}`);
const { frontmatter, body } = await run_task(
  "src/runtime/frontmatter.js",
  input,
);
const page = await run_task("src/pages/blog/[slug].html.js", {
  frontmatter,
  body,
  slug: "1900-01-01-draft",
  isDraft: true,
});
const output = await minify_html(page);

write_output(`${filename}.html`, output);
