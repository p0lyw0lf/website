import { markdown_to_html, run_js } from "driver";
import { MarkdownPage } from "../templates/MarkdownPage.js";

const { frontmatter, body } = await run_js(
  "./src/runtime/frontmatter.js",
  ARG,
);

// Parse the body as markdown, and render as HTML
const renderedBody = await markdown_to_html(body);

// Use the read frontmatter to render the final HTML
export default await MarkdownPage(frontmatter)(renderedBody.toString());
