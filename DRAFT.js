import { minify_html, run_js, write_output } from "driver";

if (!Array.isArray(ARG)) {
  throw new Error("unexpected: ARG is not an array");
}

const filename = ARG[0];
if (typeof filename !== "string") {
  throw new Error("unexpected: ARG[0] is not a string");
}

// Bare minimum pipeline adapted from ./BUILD.js
const { frontmatter, body } = await run_js(
  "src/runtime/frontmatter.js",
  `drafts/src/${filename}`,
);
// Make it so we don't have to re-generate the body every time necessarily
frontmatter.published = 0;
const page = await run_js("src/pages/blog/[slug].html.js", {
  frontmatter,
  body,
  slug: "1900-01-01-draft",
  isDraft: true,
});
const output = await minify_html(page);

write_output(`${filename}.html`, output);
