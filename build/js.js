import { minify_html, run_js, write_output } from "driver";
import { inputPathToOutputPath } from "./config.js";

/** ARG: { inputPath: string; outputPath: string } */
const { inputPath, outputPath } = ARG;

// Tests if the page defines a dynamic route
const match = /\[([a-zA-Z0-9_]+)\].*\.js$/.exec(inputPath);

if (match) {
  const replacement = match[1];
  // First, run the file without any arguments to collect the data it wants to run on
  const pages = await run_js(inputPath, null);
  // Then, run the file again for each page it wants to create
  await Promise.all(
    pages.map(async (page) => {
      let output = await run_js(inputPath, page);
      if (inputPath.endsWith(".html.js")) {
        output = await minify_html(output);
      }
      const actualInputPath = inputPath.replaceAll(
        `[${replacement}]`,
        page[replacement],
      );
      const { outputPath } = inputPathToOutputPath(actualInputPath);
      write_output(outputPath, output);
    }),
  );
} else {
  let output = await run_js(inputPath, outputPath);
  if (outputPath.endsWith(".html")) {
    output = await minify_html(output);
  }
  write_output(outputPath, output);
}
