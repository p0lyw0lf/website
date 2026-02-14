import { file_type, minify_html } from "io";
import { list_directory, run_task, write_output } from "memoized";

const root = "./src/pages/";
/** @type {Array.<string>} */
const [to_build] = ARGS ?? [root];

if (file_type(to_build) === "dir") {
  // Look for all files ending with .js in all subdirectories
  for (const entry of list_directory(to_build)) {
    if (file_type(entry) === "dir") {
      run_task("./BUILD.js", [entry]);
    } else if (entry.endsWith(".js")) {
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
}
