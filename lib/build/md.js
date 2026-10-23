import { dirname } from "../path.js";
import { frontmatter, listPages, runTemplate } from "../runtime/index.js";

/** @type {import("./types.js").TemplateInput} */
const { inputPath, outputPath } = ARG;

/** @type {import("../runtime/types.js").Page} */
const page = { ...(await frontmatter(inputPath)), outputPath };

if (inputPath.endsWith("/index.md")) {
  page.children = await listPages(dirname(inputPath));
}

if (!page.frontmatter["template"]) {
  throw new Error(`${page.inputPath} missing template in frontmatter`);
}
const template = `src/templates/${page.frontmatter["template"]}`;

/** @type {import("./types.js").TemplateOutput} */
export default await runTemplate({ template, page });
