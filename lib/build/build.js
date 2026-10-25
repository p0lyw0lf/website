import {
  file_type,
  list_directory,
  read_file,
  run_js,
  write_output,
} from "driver";
import { EXTERNAL_REPLACEMENTS, inputPathToOutputPath } from "../../CONFIG.js";
import { basename } from "../path.js";
import { minifyHtml } from "../runtime/index.js";

/**
 * @param {string} inputPath
 * @returns {Promise<void>}
 */
const build = async (inputPath) => {
  const type = await file_type(inputPath);

  if (type === "dir") {
    const entries = await list_directory(inputPath);
    const subBuild = entries.find((entry) => entry.endsWith("BUILD.js"));
    if (subBuild) {
      await run_js(subBuild, inputPath);
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        // Don't build anything starting with _
        if (basename(entry).startsWith("_")) return;

        await run_js("lib/build/build.js", entry);
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
      /** @type {import("./template/types").TemplateInput} */
      const arg = { inputPath, outputPath };
      output =
        /** @type {import("./template/types").TemplateOutput} */
        (await run_js(`lib/build/template/${ext}.js`, arg));
      if (outputPath.endsWith(".html")) {
        output = await minifyHtml(output);
      }
    } else {
      output = await read_file(inputPath);
    }
    write_output(outputPath, output);
  }
};

/** @typedef {string} Props */
await build(ARG);
