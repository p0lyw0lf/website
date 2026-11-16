import { run_js, store, write_output } from "driver";
import { html } from "./lib/html.js";
import { minifyHtml } from "./lib/runtime/index.js";
import { blog } from "./src/content/config.js";

if (!Array.isArray(ARG)) {
  throw new Error("unexpected: ARG is not an array");
}

const filename = ARG[0];
if (typeof filename !== "string") {
  throw new Error("unexpected: ARG[0] is not a string");
}

// Bare minimum pipeline adapted from ./BUILD.js
let { frontmatter, body } = await run_js(
  "lib/runtime/frontmatter.js",
  `drafts/src/${filename}`,
);
// Make it so we don't have to re-generate the body every time necessarily
frontmatter.published = 0;

let output;
// Make sure the frontmatter is parsed correctly.
try {
  frontmatter = blog.schema(frontmatter);
  output = await run_js("src/pages/blog/[slug].html.js", {
    frontmatter,
    body,
    slug: "1900-01-01-draft",
    isDraft: true,
  });
} catch (e) {
  output = store(
    html`
      <!DOCTYPE html>
      <html>
        <head
          ><title>Invalid Frontmatter</title></head
        >
        <body>
          <p> The frontmatter for this post is invalid. See error: </p>
          <pre style="color:red"><code>${e}</code></pre>
          <pre><code>${JSON.stringify(frontmatter)}</code></pre>
        </body>
      </html>
    `.toString(),
  );
}

write_output(`${filename}.html`, await minifyHtml(output));
