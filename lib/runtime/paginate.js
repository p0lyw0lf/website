import { file_type, list_directory, mtime, write_output } from "driver";
import { inputPathToOutputPath } from "../build/config.js";
import { basename, dirname, splitext } from "../path.js";
import { minifyHtml, runTemplate as runTemplateOrig } from "./index.js";

/**
 * ARG: {
 *   inputPath: string, representing a page inside the directory of the entires you want to paginate for.
 *   frontmatter: {
 *     pageTemplate: string, representing a template that should be applied to each paginated page.
 *     paginateCount: number, representing how many items per page there should be.
 *   },
 * }
 */

if (typeof ARG.inputPath !== "string") {
  throw new Error("inputPath must be string");
}
const { pageTemplate, itemTemplate, paginateCount } = ARG.frontmatter;
if (typeof pageTemplate !== "string") {
  throw new Error("pageTemplate must be string");
}
if (typeof itemTemplate !== "string") {
  throw new Error("itemTemplate must be a string");
}
if (typeof paginateCount !== "number") {
  throw new Error("paginateCount must be number");
}
const byMtime = !!ARG.frontmatter.byMtime;

const { outputPath: originalOutputPath } = inputPathToOutputPath(ARG.inputPath);
const paginateRoot = dirname(originalOutputPath);

const originalInputDir = dirname(ARG.inputPath);

/** @type {string | undefined} */
let directory = originalInputDir;
/** @type {string[]} */
const filenames = [];
/** @type {string[]} */
const directoriesToExplore = [];
while (directory) {
  const entries = await list_directory(directory);
  await Promise.all(
    entries.map(async (entry) => {
      if (basename(entry).startsWith("_")) {
        return;
      }
      if (entry === ARG.inputPath) {
        return;
      }

      const type = await file_type(entry);
      if (type === "file") {
        filenames.push(entry);
      } else if (type === "dir") {
        // Recur into subdirectories
        directoriesToExplore.push(entry);
      }
    }),
  );
  directory = directoriesToExplore.pop();
}

const pages = await Promise.all(
  filenames.map(async (inputPath) => {
    const { outputPath: mediaOutputPath } = inputPathToOutputPath(inputPath);
    const [base, _] = splitext(inputPath);
    const { outputPath } = inputPathToOutputPath(`${base}.html`);
    return {
      inputPath,
      outputPath,
      mediaOutputPath,
      mtime: await mtime(inputPath),
    };
  }),
);
if (byMtime) {
  pages.sort((a, b) => b.mtime - a.mtime);
} else {
  pages.sort((a, b) => b.mediaOutputPath.localeCompare(a.mediaOutputPath));
}

/**
 * @param {string} templateName
 * @param {import("./types.js").Page} page
 */
const runTemplate = async (templateName, page) => {
  const template = `src/templates/${templateName}`;
  const output = await runTemplateOrig({ template, page });
  return await minifyHtml(output);
};

// Create the overall collection pages
const total = Math.ceil(pages.length / paginateCount);
const paginated = [];
for (let i = 0; i * paginateCount < pages.length; i += 1) {
  const items = pages.slice(i * paginateCount, (i + 1) * paginateCount);

  const { outputPath } = inputPathToOutputPath(
    `${originalInputDir}/${i + 1}.html`,
  );
  const page = {
    ...ARG,
    number: i + 1,
    total,
    items,
    outputPath,
    paginateRoot,
  };

  const output = await runTemplate(pageTemplate, page);
  write_output(outputPath, output);

  paginated.push({ number: i + 1, total, items, outputPath, paginateRoot });
}

// Create the individual item pages
await Promise.all(
  pages.map(async (item, index) => {
    const prevItem = pages[index - 1];
    const nextItem = pages[index + 1];

    const output = await runTemplate(itemTemplate, {
      ...ARG,
      item,
      prevItem,
      nextItem,
      outputPath: item.outputPath,
      paginateRoot,
    });
    write_output(item.outputPath, output);
  }),
);

export default paginated;
