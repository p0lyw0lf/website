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
const dynamicRegex = /\[[a-zA-Z0-9_]+\]\.html\.js$/;

/**
 * @param {string} to_build
 * @returns {Promise<void>}
 */
const build = async (to_build) => {
  let match;
  if (file_type(to_build) === "dir") {
    const entries = await list_directory(to_build);
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
  } else if (to_build.startsWith(PUBLIC_ROOT)) {
    // Copy file to output
    const pathname = to_build.slice(PUBLIC_ROOT.length);
    const output = await read_file(to_build);
    write_output(pathname, output);
  } else if ((match = dynamicRegex.exec(to_build))) {
    const base_dir = to_build.slice(PAGE_ROOT.length, match.index);
    // First, run the file without any arguments to collect the data it wants to run on
    const pages = await run_task(to_build, null);
    // Then, run the file again for each page it wants to create
    await Promise.all(
      pages.map(async (page) => {
        let output = await run_task(to_build, page);
        output = await minify_html(output);
        write_output(`${base_dir}/${page.slug}/index.html`, output);
      }),
    );
  } else if (to_build.endsWith(".js")) {
    // Execute the file to build (assuming it's javascript)
    let pathname = to_build.slice(PAGE_ROOT.length, -3);
    if (pathname.endsWith(".html") && !pathname.endsWith("index.html")) {
      // Path should actually be a directory
      pathname = pathname.slice(0, -".html".length);
      pathname = `${pathname}/index.html`;
    }
    let output = await run_task(to_build, pathname);
    if (to_build.endsWith(".html.js")) {
      output = await minify_html(output);
    }
    write_output(pathname, output);
  } else if (to_build.endsWith(".md")) {
    // Render the file as markdown
    const pathname = `${to_build.slice(PAGE_ROOT.length, -3)}/index.html`;
    let output = await run_task("src/build/md.js", to_build);
    output = await minify_html(output);
    write_output(pathname, output);
  }
};

if (ARG) {
  await build(ARG);
} else {
  await build(PAGE_ROOT);
  await build(PUBLIC_ROOT);
}
