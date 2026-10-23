import {
  file_type,
  list_directory,
  read_file,
  run_js,
  write_output,
} from "driver";
import { basename } from "../path.js";
import { minifyHtml } from "../runtime/index.js";
import {
  EXTERNAL_REPLACEMENTS,
  inputPathToOutputPath,
  PAGE_ROOT,
  PUBLIC_ROOT,
} from "./config.js";

/**
 * @param {string} inputPath
 * @returns {Promise<void>}
 */
const build = async (inputPath) => {
  const type = await file_type(inputPath);
  const isPublic = inputPath.startsWith(PUBLIC_ROOT);

  if (isPublic) {
    if (type === "dir") {
      const entries = await list_directory(inputPath);
      await Promise.all(
        entries.map(async (entry) => {
          await run_js("lib/build/index.js", entry);
        }),
      );
    } else {
      // Copy file to output
      const outputPath = inputPath.slice(PUBLIC_ROOT.length);
      const output = await read_file(inputPath);
      write_output(outputPath, output);
    }
    return;
  }

  if (type === "dir") {
    const entries = await list_directory(inputPath);
    const subBuild = entries.find((entry) => entry.endsWith("BUILD.js"));
    if (subBuild) {
      await run_js(subBuild, null);
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        // Don't build anything starting with _
        if (basename(entry).startsWith("_")) return;

        await run_js("lib/build/index.js", entry);
      }),
    );
  } else {
    const { outputPath, ext, build } = inputPathToOutputPath(inputPath);

    // Don't output anything that would instead be hosted externally.
    for (const [regex] of EXTERNAL_REPLACEMENTS) {
      if (regex.test(outputPath)) {
        return;
      }
    }

    /** @type {import("driver").StoreObject} */
    let output;
    if (build) {
      /** @type {import("./types").TemplateInput} */
      const arg = { inputPath, outputPath };
      output =
        /** @type {import("./types").TemplateOutput} */
        (await run_js(`lib/build/${ext}.js`, arg));
      if (outputPath.endsWith(".html")) {
        output = await minifyHtml(output);
      }
    } else {
      output = await read_file(inputPath);
    }
    write_output(outputPath, output);
  }
};

if (typeof ARG === "string") {
  await build(ARG);
} else {
  // Ignore command-line arguments passed as array
  await Promise.all([build(PAGE_ROOT), build(PUBLIC_ROOT)]);
}
