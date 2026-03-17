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

/**
 * @param {string} to_build
 * @returns {Promise<void>}
 */
const build = async (to_build) => {
  if (file_type(to_build) === "dir") {
    const entries = await list_directory(to_build);
    await Promise.all(
      entries.map(async (entry) => {
        if (file_type(entry) === "dir") {
          await run_task("BUILD.js", [entry]);
        } else if (
          entry.startsWith(PUBLIC_ROOT) ||
          entry.endsWith(".js") ||
          entry.endsWith(".md")
        ) {
          await run_task("BUILD.js", [entry]);
        }
      }),
    );
  } else if (to_build.startsWith(PUBLIC_ROOT)) {
    // Copy file to output
    const pathname = to_build.slice(PUBLIC_ROOT.length);
    const output = await read_file(to_build);
    write_output(pathname, output);
  } else if (to_build.endsWith(".js")) {
    // Execute the file to build (assuming it's javascript)
    const pathname = to_build.slice(PAGE_ROOT.length, -3);
    let output = await run_task(to_build, [pathname]);
    if (to_build.endsWith(".html.js")) {
      output = await minify_html(output);
    }
    write_output(pathname, output);
  } else if (to_build.endsWith(".md")) {
    // Render the file as markdown
    const pathname = `${to_build.slice(PAGE_ROOT.length, -3)}/index.html`;
    let output = await run_task("src/runtime/markdown.js", [to_build]);
    output = await minify_html(output);
    write_output(pathname, output);
  }
};

if (ARG) {
  await build(ARG[0]);
} else {
  await build(PAGE_ROOT);
  await build(PUBLIC_ROOT);
}
