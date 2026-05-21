import { slugifyPath, splitext } from "../src/path.js";

/** A folder that will be built to generate all the pages in the site. */
export const PAGE_ROOT = "./src/pages/";
/** A folder that, whatever is placed inside, will get copied verbatim to the output. */
export const PUBLIC_ROOT = "./public/";

/**
 * MODIFY: If you use markdown `![]()` syntax with these, it will create a
 * `<video>` element instead of an `<img>` one.
 * See src/runtime/markdown.js
 */
export const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".mov", ".webm"];

/**
 * MODIFY: If you would like to transform remote images in addition to local ones,
 * set this to match your website. Otherwise, set it to undefined.
 */
export const ALLOWED_REMOTE_REGEX = /^https:\/\/static\.wolfgirl\.dev\//;

// Maps a file extension of a source page to the extension the page should have in the output.
export const BUILD_EXTS = {
  "html.js": { builder: "js", ext: "html" },
  "xml.js": { builder: "js", ext: "xml" },
  md: { builder: "md", ext: "html" },
};

/**
 * @param {string} inputPath - a path that will correspond to a file in the output.
 * @returns {{ outputPath: string; builder: string }} - `builder` MUST correspond with a file in the `./build` directory.
 */
export const inputPathToOutputPath = (inputPath) => {
  let [outputPath, fullExt] = splitext(
    slugifyPath(inputPath.slice(PAGE_ROOT.length)),
  );

  const data = BUILD_EXTS[fullExt];
  if (!data) {
    throw new Error(`invalid extension on ${inputPath}`);
  }

  const { builder, ext } = data;
  outputPath += `.${ext}`;

  // Special handling for HTML files: Make all non-index pages their own directory instead of ending with .html
  if (
    outputPath.endsWith(".html") &&
    !outputPath.endsWith("/index.html") &&
    outputPath !== "index.html"
  ) {
    outputPath = outputPath.slice(0, -".html".length);
    outputPath += "/index.html";
  }

  return { outputPath, builder };
};
