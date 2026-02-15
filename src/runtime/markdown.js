import { markdown_to_html, read_file, store } from "driver";
import { MarkdownPage } from "../templates/MarkdownPage";

/** @type {string} */
const content = read_file(`../../${ARGS[0]}`).toString();

// Split file into frontmatter (where the props are) and the body
const [, rawFrontmatter, ...bodyParts] = content.split("---\n");
const body = bodyParts.join("---\n");

// Parse the body as markdown, and render as HTML
const renderedBody = markdown_to_html(store(body));

/** @type {any} */
const frontmatter = {};
// Read the frontmatter into a Javascript object
for (const line of rawFrontmatter.split("\n")) {
  if (!line.trim()) continue;
  const i = line.indexOf(":");
  const prop = line.slice(0, i);
  const value = JSON.parse(line.slice(i + 2));
  frontmatter[prop] = value;
}

// Use the read frontmatter to render the final HTML
export default MarkdownPage(frontmatter)(renderedBody.toString());
