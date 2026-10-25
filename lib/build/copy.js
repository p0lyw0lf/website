import {
  file_type,
  list_directory,
  read_file,
  run_js,
  write_output,
} from "driver";

/**
 * @typedef {object} Props
 * @property {string} inputPath
 * @property {string} root
 */
/** @type {Props} */
const { inputPath, root } = ARG;

const type = await file_type(inputPath);
if (type === "dir") {
  const entries = await list_directory(inputPath);
  await Promise.all(
    entries.map(async (entry) => {
      await run_js("lib/build/copy.js", { inputPath: entry, root });
    }),
  );
} else {
  // Copy file to output
  const outputPath = inputPath.slice(root.length);
  const output = await read_file(inputPath);
  write_output(outputPath, output);
}
