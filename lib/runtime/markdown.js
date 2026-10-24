import { file_type, get_url, read_file, run_js, store } from "driver";
import {
  ALLOWED_REMOTE_REGEX,
  AUDIO_EXTENSIONS,
  inputPathToOutputPath,
  MEDIA_COMPONENTS,
  SITE_URL,
  VAULT_ROOT,
  VIDEO_EXTENSIONS,
} from "../../CONFIG.js";
import { dirname } from "../path.js";
import { replaceMatches } from "../regex.js";
import { plainMarkdownToHtml } from "./index.js";

/** @typedef {import("driver").StoreObject | import("./types.js").Page} Props */
/** @type {Props} */
const arg = ARG;

/** @type {string} */
let input;
/** @type {string | undefined} */
let inputDir = undefined;
/** @type {any | undefined} */
let frontmatter = undefined;
if ("body" in arg && "inputPath" in arg) {
  inputDir = dirname(ARG.inputPath);
  input = ARG.body.toString();
  frontmatter = ARG.frontmatter;
} else {
  input = ARG.toString();
}

/**
 * Given a store argument in ARG, format the markdown as HTML, applying any special transformations
 * that we need to have happen.
 *
 * Specifically, transform all remote images matching a regex to be local, minified ones.
 *
 * ARG: StoreObject
 */

const IMAGE_REGEX =
  /!\[(?<alt>[^\]]*)\]\(((<(?<quotedFilename>.*)>)|(?<filename>[^<>]*?))\s*(\"(?<title>.*)\")?\)/gm;
const REMOTE_REGEX = /^https?:\/\//;

/**
 * @param {RegExpMatchArray} match
 * @returns {Promise<
 *    { type: "image" | "audio" | "video"; isRemote: boolean; url: string } |
 *    undefined
 *  >} - If we want to transform this source, the StoreObject to transform.
 */
const fetchSource = async (match) => {
  const quotedFilename = match.groups?.["quotedFilename"];
  const filename = quotedFilename || match.groups?.["filename"] || "";
  if (!filename) {
    return undefined;
  }

  let url = filename;
  const isRemote = REMOTE_REGEX.test(filename);
  if (isRemote) {
    if (quotedFilename) {
      url = encodeURI(url);
    }
  } else {
    // Try to resolve the local filename
    url = (await resolveFile(url)) || "";
    if (!url) {
      print(`WARNING: could not resolve local file in markdown: ${filename}`);
      return undefined;
    }
  }

  /** @type {"video" | "audio" | "image"} */
  let type;
  if (VIDEO_EXTENSIONS.some((extension) => filename.endsWith(extension))) {
    type = "video";
  } else if (
    AUDIO_EXTENSIONS.some((extension) => filename.endsWith(extension))
  ) {
    type = "audio";
  } else {
    type = "image";
  }

  if (type === "image") {
    if (ALLOWED_REMOTE_REGEX.test(filename)) {
      return { type: "image", isRemote: true, url };
    }
    // Don't transform other remote images
    if (isRemote) {
      return undefined;
    }

    // Local images (!isRemote) are fine to transform.
    return { type: "image", isRemote: false, url };
  }

  // Other sources don't get transformed the same way, just return outright
  return { type, isRemote, url };
};

/**
 * Given a markdown image filename, tries to resolve it to a path that can be passed to `read_file`.
 *
 * @param {string} filename
 * @returns {Promise<string | undefined>}
 */
const resolveFile = async (filename) => {
  /**
   * There are four total possible scenarios:
   *
   *             | Relative to ARG.filename | Relative to VAULT_ROOT |
   * ------------+--------------------------+------------------------+
   * Not encoded |            A             |            C           |
   * ------------+--------------------------+------------------------+
   * URI-encoded |            B             |            D           |
   * ------------+--------------------------+------------------------+
   *
   * To support the broadest range possible, try all of these files, in the order ABCD.
   */

  if (filename.startsWith("./")) {
    filename = filename.slice("./".length);
  }

  let resolved;
  if (inputDir) {
    // A
    resolved = await tryResolve(`${inputDir}/${filename}`);
    if (resolved) return resolved;

    // B
    resolved = await tryResolve(`${inputDir}/${decodeURIComponent(filename)}`);
    if (resolved) return resolved;
  }

  // C
  resolved = await tryResolve(VAULT_ROOT + filename);
  if (resolved) return resolved;

  // D
  resolved = await tryResolve(VAULT_ROOT + decodeURIComponent(filename));
  if (resolved) return resolved;

  return undefined;
};

/**
 * @param {string} path
 * @returns {Promise<string | undefined>} undefined if the path doesn't exist
 */
const tryResolve = async (path) => {
  try {
    await file_type(path);
    return path;
  } catch {
    return undefined;
  }
};

/**
 * @param {RegExpMatchArray} match
 * @return {Promise<import("driver").StoreObject | string>}
 */
const toMediaElem = async (match) => {
  const source = await fetchSource(match);
  if (!source) {
    return match[0];
  }

  let url = source.url;
  if (!source.isRemote) {
    url = `${SITE_URL}/${inputPathToOutputPath(url).outputPath}`;
  }

  /** @type {import("driver").StoreObject} */
  let src;
  switch (source.type) {
    case "video":
      return await run_js(MEDIA_COMPONENTS.Video, { url });
    case "audio":
      return await run_js(MEDIA_COMPONENTS.Audio, { url });
    case "image":
      if (source.isRemote) {
        src = await get_url(source.url);
      } else {
        src = await read_file(source.url);
      }
      break;
    default:
      return match[0];
  }

  const alt = match.groups?.["alt"] || undefined;
  const title = match.groups?.["title"] || undefined;
  const defaultOpts = frontmatter?.defaultOpts;
  const otherOpts = frontmatter?.otherOpts;
  return await run_js(MEDIA_COMPONENTS.Image, {
    src,
    url,
    alt,
    title,
    defaultOpts,
    otherOpts,
  });
};

const body = await replaceMatches(IMAGE_REGEX, input, async (match) => {
  return (await toMediaElem(match)).toString();
});

export default await plainMarkdownToHtml(store(body));
