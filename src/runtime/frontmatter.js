import { read_file, store } from "driver";

/**
 * Given a pathname ARG, parses it into `[frontmatter, body]`,
 * where `frontmatter` is an object and `body` is a StoreObject.
 */

const contents = (await read_file(ARG)).toString();

// Split file into frontmatter (where the props are) and the body
const [, rawFrontmatter, ...bodyParts] = contents.split("---\n");
if (rawFrontmatter === undefined) {
  throw new Error(`${ARG} is missing frontmatter`);
}

// This is a _very_ hacky YAML parser, but I think it gets the job done with what Obsidian outputs at least

/**
 * @param {string} value
 * @returns {any}
 */
const parseValue = (value) => {
  value = value.trim();
  if (!value) {
    return undefined;
  }

  const n = Number(value);
  if (!isNaN(n)) {
    return n;
  }

  if (
    value === "undefined" ||
    value === "null" ||
    value === "true" ||
    value === "false" ||
    (value[0] === '"' && value[value.length - 1] === '"') ||
    (value[0] === "[" && value[value.length - 1] === "]") ||
    (value[0] === "{" && value[value.length - 1] === "}")
  ) {
    return JSON.parse(value);
  }
  return value;
};

/** @type {Record<string, import("driver").Arg>} */
const frontmatter = {};
let arrayKey = undefined;
// Read the frontmatter into a Javascript object
for (const line of rawFrontmatter.split("\n")) {
  if (arrayKey) {
    if (line.startsWith("  -")) {
      frontmatter[arrayKey] = frontmatter[arrayKey] ?? [];
      frontmatter[arrayKey].push(parseValue(line.slice(3)));
      continue;
    } else {
      arrayKey = undefined;
    }
  }
  const i = line.indexOf(":");
  const key = line.slice(0, i).trim();
  if (!key) continue;
  const value = parseValue(line.slice(i + 1));
  if (value === undefined) {
    arrayKey = key;
  }
  frontmatter[key] = value;
}

const body = bodyParts.join("---\n");

export default {
  inputPath: ARG,
  frontmatter,
  body: store(body),
};
