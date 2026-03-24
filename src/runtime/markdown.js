import { run_task } from "driver";

/**
 * Given a store argument in ARG, format the markdown as HTML, applying any special transformations
 * that we need to have happen.
 *
 * Specifically, transform all remote images matching a regex to be local, minified ones.
 */

const IMAGE_REGEX =
  /!\[(?<alt>[^\]]*)\]\(((<(?<quotedFilename>.*)>)|(?<filename>[^<>]*?))\s*(\"(?<title>.*)\")?\)/gm;
const ALLOWED_SITES = new Set(["static.wolfgirl.dev"]);

const contents = ARG.toString();

// TODO: see if Astro does this any better. I think not really?
const urls = new Set();
for (const match of contents.matchAll(IMAGE_REGEX)) {
  const filename = match.groups.quotedFilename || match.groups.filename || "";
  if (!filename) continue;
  /** @type {URL} */
  let url;
  try {
    url = new URL(filename);
  } catch {
    continue;
  }
  if (!ALLOWED_SITES.has(url.hostname)) continue;

  urls.add(filename);
}

const processed = await Promise.all(
  [...urls].map(async (url) => {
    const imageHtml = await run_task("src/runtime/remoteImage.js", {
      url,
      alt: "TODO",
      title: "TODO",
      widths: [384, 768, 1536],
    });
    return imageHtml;
  }),
);

// TODO: finish this
