import { slugifyPath, splitext } from "./lib/path.js";

/**
 * MODIFY: replace this with the subfolder under your domain this site will
 * live in, **not including a trailing slash**.
 *
 * e.x.:
 * + if the output will be at https://wolfgirl.dev, then SITE_URL = ""
 * + if the output will be at https://foobar.com/baz, then SITE_URL = "/baz"
 */
export const SITE_URL = "";

/** MODIFY: A folder that will be built to generate all the pages in the site. MUST contain a trailing slash.
 *
 * This is the one that markdown files go under.
 */
export const PAGE_ROOT = "./src/pages/";
/** MODIFY: A folder that, whatever is placed inside, will get copied verbatim
 * to the output. MUST include a trailing slash.
 *
 * This is the one that **non-transformed** media files go under.
 */
export const PUBLIC_ROOT = "./public/";
/**
 * MODIFY: The directory inside this project you've linked your Obsidian Vault
 * to, **including a trailing slash**. This is used for looking up images. It
 * can be different from PAGE_ROOT in case PAGE_ROOT contains some non-obsidian
 * files.
 */
export const VAULT_ROOT = PAGE_ROOT;

/**
 * MODIFY: If you use markdown `![]()` syntax with these, it will create a
 * `<video>` element instead of an `<img>` one.
 * See src/runtime/markdown.js
 */
export const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".mov", ".webm"];

/**
 * MODIFY: Similar to `VIDEO_EXTENSIONS`, if you have an `![]()` with these, it
 * will create an `<audio>` element.
 */
export const AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".m4a"];

/**
 * MODIFY: When running `markdownToHtml`, what component
 * should we use for media? Provide a javascript filename
 * relative to the project root for this.
 */
export const MEDIA_COMPONENTS = {
  Audio: "lib/components/Audio.js",
  Image: "src/components/BlogImage.js",
  Video: "lib/components/Video.js",
};

/**
 * MODIFY: In galleries, this will be used as a prefix for audio/video
 * filenames to show as a thumbnail on the page of collected items.
 *
 * MUST start with an "_"
 */
export const THUMBNAIL_PREFIX = "_thumb/";

/**
 * MODIFY: In galleries, the filetype of thumbnails stored next to video/audio
 * files.
 */
export const THUMBNAIL_SUFFIX = ".png";

/**
 * MODIFY: If you would like to transform remote images in addition to local
 * ones, set this to match your website. Otherwise, set it to undefined.
 */
export const ALLOWED_REMOTE_REGEX = /^https:\/\/static\.wolfgirl\.dev\//;

/**
 * How this works: for each regex, check if the path we would output to
 * matches. If so, we _don't_ write it to the output, and any time this
 * URL would be used, we instead construct a URL by taking the first
 * capturing group from the regex and substitutes it into "%s" in the
 * second part.
 *
 * If the second part is `undefined`, we will not output the file, but we also
 * won't do any URL replacement.
 *
 * @type{Array<[RegExp, string]>}
 */
export const EXTERNAL_REPLACEMENTS = [
  [/^(.*image-with-spaces\.png)$/, "https://wolfgirl.dev/apple-touch-icon.png"],
];

/**
 * @typedef {object} BuildProps
 * @property {boolean} alwaysHTML - Whether the coresponding template extension always produces an HTML output.
 */
/** @type{{[index: string]: BuildProps}} */
export const BUILD_EXTS = {
  js: { alwaysHTML: false },
  md: { alwaysHTML: true },
  tera: { alwaysHTML: false },
};

/**
 * @param {string} inputPath - a path that will correspond to a file in the output.
 * @returns {{ outputPath: string; ext: string, build: boolean }} - if `build` is true, `ext` MUST correspond with a file in the `./build` directory.
 */
export const inputPathToOutputPath = (inputPath) => {
  let [outputPath, ext] = splitext(
    slugifyPath(inputPath.slice(PAGE_ROOT.length)),
  );

  const builder = BUILD_EXTS[ext];
  if (builder?.alwaysHTML) {
    outputPath += ".html";
  }
  if (!builder) {
    outputPath += "." + ext;
  }

  if (
    outputPath.endsWith(".html") &&
    !outputPath.endsWith("/index.html") &&
    outputPath !== "index.html"
  ) {
    // Make all non-index pages their own directory instead of HTML files.
    outputPath = outputPath.slice(0, -".html".length);
    outputPath += "/index.html";
  }

  return { outputPath, ext, build: !!builder };
};
