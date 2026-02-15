import { file_type, minify_html, write_output } from "io";
import { list_directory, run_task } from "memoized";

const root = "./src/pages/";
/** @type {Array.<string>} */
const [to_build] = ARGS ?? [root];

if (file_type(to_build) === "dir") {
  // Look for all files ending with .js in all subdirectories
  for (const entry of list_directory(to_build)) {
    if (file_type(entry) === "dir") {
      run_task("./BUILD.js", [entry]);
    } else if (entry.endsWith(".js") || entry.endsWith(".md")) {
      run_task("./BUILD.js", [entry]);
    }
  }
} else if (to_build.endsWith(".js")) {
  // Execute the file to build (assuming it's javascript)
  const pathname = to_build.slice(root.length, -3);
  let output = run_task(to_build, [pathname]);
  if (to_build.endsWith(".html.js")) {
    output = minify_html(output);
  }
  write_output(pathname, output);
} else if (to_build.endsWith(".md")) {
  // Render the file as markdown
  const pathname = `${to_build.slice(root.length, -3)}/index.html`;
  let output = run_task("./src/runtime/markdown.js", [to_build]);
  output = minify_html(output);
  write_output(pathname, output);
}
