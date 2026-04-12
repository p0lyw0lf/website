import { read_file, store } from "driver";

/**
 * Given a filename in ARG, parses it into `[frontmatter, body]`,
 * where `frontmatter` is an object and `body` is a StoreObject.
 */

const contents = (await read_file(ARG)).toString();

// Split file into frontmatter (where the props are) and the body
const [, rawFrontmatter, ...bodyParts] = contents.split("---\n");

/** @type {Record<string, import("driver").Arg>} */
const frontmatter = {};
// Read the frontmatter into a Javascript object
for (const line of rawFrontmatter.split("\n")) {
  if (!line.trim()) continue;
  const i = line.indexOf(":");
  const prop = line.slice(0, i);
  const value = JSON.parse(line.slice(i + 2));
  frontmatter[prop] = value;
}

const body = store(bodyParts.join("---\n"));

export default { frontmatter, body };
