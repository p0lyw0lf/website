import { run_js, write_output } from "driver";
import { minifyHtml } from "../runtime";

/** @param {import("./build").Props} path */
export const build = async (path) => {
  await run_js("lib/build/build.js", path);
};

/** @param {import("./copy").Props} path */
export const copy = async (path) => {
  await run_js("lib/build/copy.js", path);
};

/**
 * @template Entry
 * @param {() => Promise<Entry[]>} list
 * @param {(e: Entry) => Promise<import("driver").StoreObject>} buildEntry
 * @param {(e: Entry) => string} toOutputPath
 */
export const dynamic = async (list, buildEntry, toOutputPath) => {
  const entries = await list();
  await Promise.all(
    entries.map(async (entry) => {
      const outputPath = toOutputPath(entry);
      let output = await buildEntry(entry);
      if (outputPath.endsWith(".html")) {
        output = await minifyHtml(output);
      }
      write_output(outputPath, output);
    }),
  );
};
