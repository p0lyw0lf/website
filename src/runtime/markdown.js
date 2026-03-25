import { markdown_to_html, minify_html, run_task, store } from "driver";
import { replaceMatches } from "../util.js";

/**
 * Given a store argument in ARG, format the markdown as HTML, applying any special transformations
 * that we need to have happen.
 *
 * Specifically, transform all remote images matching a regex to be local, minified ones.
 */

const IMAGE_REGEX =
  /!\[(?<alt>[^\]]*)\]\(((<(?<quotedFilename>.*)>)|(?<filename>[^<>]*?))\s*(\"(?<title>.*)\")?\)/gm;
const ALLOWED_SITES = new Set(["static.wolfgirl.dev"]);

/**
 * @param {RegExpMatchArray} match
 * @returns {boolean} - Should we transform this image match?
 */
const shouldTransform = (match) => {
  const filename = match.groups.quotedFilename || match.groups.filename || "";
  if (!filename) return false;
  /** @type {URL} */
  let url;
  try {
    url = new URL(filename);
  } catch {
    return false;
  }
  if (!ALLOWED_SITES.has(url.hostname)) return false;

  return true;
};

const contents = await replaceMatches(
  IMAGE_REGEX,
  ARG.toString(),
  async (match) => {
    if (!shouldTransform(match)) return match[0];

    const url =
      match.groups.quotedFilename || match.groups.filename || undefined;
    const alt = match.groups.alt || undefined;
    const title = match.groups.title || undefined;
    return await run_task("src/runtime/remoteImage.js", {
      url,
      alt,
      title,
      widths: [384, 768, 1536],
    });
  },
);

export default await minify_html(await markdown_to_html(store(contents)));
