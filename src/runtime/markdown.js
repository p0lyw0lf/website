import { markdown_to_html, minify_html, store } from "driver";
import { ALLOWED_REMOTE_REGEX, VIDEO_EXTENSIONS } from "../../build/config.js";
import { BlogImage } from "../components/blog/BlogImage.js";
import { html } from "../render.js";
import { replaceMatches } from "../util.js";

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
 *    { type: "remoteImage", url: string } |
 *    { type: "video", url: string } |
 *    undefined
 *  >} - If we want to transform this source, the StoreObject to transform.
 */
const fetchSource = async (match) => {
  const filename = match.groups.quotedFilename || match.groups.filename || "";
  if (!filename) {
    return undefined;
  }

  let url = filename;
  if (REMOTE_REGEX.test(filename)) {
    if (match.groups.quotedFilename) {
      url = encodeURI(url);
    }
  }

  if (VIDEO_EXTENSIONS.some((extension) => filename.endsWith(extension))) {
    return { type: "video", url };
  }

  if (ALLOWED_REMOTE_REGEX.test(filename)) {
    return { type: "remoteImage", url };
  }

  // Don't transform other images
  return undefined;
};

const input = ARG.toString();
const output = await replaceMatches(IMAGE_REGEX, input, async (match) => {
  let src = await fetchSource(match);
  let url;
  switch (src?.type) {
    case "video":
      return html`<video src="${src.url}" controls></video>`;
    case "remoteImage":
      url = src.url;
      break;
    default:
      return match[0];
  }

  const alt = match.groups.alt || undefined;
  const title = match.groups.title || undefined;
  return await BlogImage({ url, alt, title });
});

export default await minify_html(await markdown_to_html(store(output)));
