import { minify_html, run_js, write_output } from "driver";

/** ARG: { inputPath: string; outputPath: string } */
const { inputPath, outputPath } = ARG;

const page = await run_js("src/runtime/frontmatter.js", inputPath);
page.outputPath = outputPath;

if (!page.frontmatter.template) {
  throw new Error(`${page.filename} missing template in frontmatter`);
}
const template = `src/templates/${page.frontmatter.template}`;

let output = await run_js(template, page);
if (outputPath.endsWith(".html")) {
  output = await minify_html(output);
}

write_output(outputPath, output);
