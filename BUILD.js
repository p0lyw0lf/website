import {
  file_type,
  list_directory,
  read_file,
  run_js,
  write_output,
} from "driver";
import {
  BUILD_EXTS,
  inputPathToOutputPath,
  PAGE_ROOT,
  PUBLIC_ROOT,
} from "./build/config.js";
import { basename } from "./src/path.js";

/**
 * @param {string} inputPath
 * @returns {Promise<void>}
 */
const build = async (inputPath) => {
  const isPublic = inputPath.startsWith(PUBLIC_ROOT);

  if (isPublic) {
    if (file_type(inputPath) === "dir") {
      const entries = await list_directory(inputPath);
      await Promise.all(
        entries.map(async (entry) => {
          await run_js("BUILD.js", entry);
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

  if (file_type(inputPath) === "dir") {
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

        if (file_type(entry) === "dir") {
          await run_js("BUILD.js", entry);
        } else if (
          Object.keys(BUILD_EXTS).some((ext) => entry.endsWith(`.${ext}`))
        ) {
          await run_js("BUILD.js", entry);
        }
      }),
    );
  } else {
    const { outputPath, builder } = inputPathToOutputPath(inputPath);
    await run_js(`./build/${builder}.js`, { inputPath, outputPath });
  }
};

if (typeof ARG === "string") {
  await build(ARG);
} else {
  // Ignore command-line arguments passed as array
  await Promise.all([build(PAGE_ROOT), build(PUBLIC_ROOT)]);
}
