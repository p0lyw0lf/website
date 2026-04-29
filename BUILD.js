import {
  file_type,
  list_directory,
  minify_html,
  read_file,
  run_task,
  write_output,
} from "driver";
const PAGE_ROOT = "./src/pages/";
const PUBLIC_ROOT = "./public/";

// Tests if the page defines a dynamic route
const dynamicRegex = /\[([a-zA-Z0-9_]+)\].*\.js$/;

const inputPathToOutputPath = (inputPath) => {
  let outputPath;
  if (inputPath.endsWith(".js")) {
    // Execute the file to build (assuming it's javascript)
    outputPath = inputPath.slice(PAGE_ROOT.length, -3);
    if (outputPath.endsWith(".html") && !outputPath.endsWith("index.html")) {
      // Path should actually be a directory
      outputPath = outputPath.slice(0, -".html".length);
      outputPath = `${outputPath}/index.html`;
    }
  } else if (inputPath.endsWith(".md")) {
    // Render the file as markdown
    outputPath = `${inputPath.slice(PAGE_ROOT.length, -3)}/index.html`;
  } else {
    throw new Error(`not an input path: ${inputPath}`);
  }

  return outputPath;
};

/**
 * @param {string} inputPath
 * @returns {Promise<void>}
 */
const build = async (inputPath) => {
  let match;
  if (file_type(inputPath) === "dir") {
    const entries = await list_directory(inputPath);
    await Promise.all(
      entries.map(async (entry) => {
        if (file_type(entry) === "dir") {
          await run_task("BUILD.js", entry);
        } else if (
          entry.startsWith(PUBLIC_ROOT) ||
          entry.endsWith(".js") ||
          entry.endsWith(".md")
        ) {
          await run_task("BUILD.js", entry);
        }
      }),
    );
  } else if (inputPath.startsWith(PUBLIC_ROOT)) {
    // Copy file to output
    const outputPath = inputPath.slice(PUBLIC_ROOT.length);
    const output = await read_file(inputPath);
    write_output(outputPath, output);
  } else if ((match = dynamicRegex.exec(inputPath))) {
    const replacement = match[1];
    // First, run the file without any arguments to collect the data it wants to run on
    const pages = await run_task(inputPath, null);
    // Then, run the file again for each page it wants to create
    await Promise.all(
      pages.map(async (page) => {
        let output = await run_task(inputPath, page);
        if (inputPath.endsWith(".html.js")) {
          output = await minify_html(output);
        }
        const actualInputPath = inputPath.replaceAll(
          `[${replacement}]`,
          page[replacement],
        );
        const outputPath = inputPathToOutputPath(actualInputPath);
        write_output(outputPath, output);
      }),
    );
  } else if (inputPath.endsWith(".js")) {
    const outputPath = inputPathToOutputPath(inputPath);
    let output = await run_task(inputPath, outputPath);
    if (inputPath.endsWith(".html.js")) {
      output = await minify_html(output);
    }
    write_output(outputPath, output);
  } else if (inputPath.endsWith(".md")) {
    const outputPath = inputPathToOutputPath(inputPath);
    // Render the file as markdown
    const input = await read_file(inputPath);
    let output = await run_task("src/build/md.js", input);
    output = await minify_html(output);
    write_output(outputPath, output);
  }
};

if (ARG) {
  await build(ARG);
} else {
  await build(PAGE_ROOT);
  await build(PUBLIC_ROOT);
}
