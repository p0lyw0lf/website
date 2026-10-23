import { read_file, store } from "driver";

/**
 * @typedef {string} Props - The path to the file to parse
 */
/** @type {Props} */
const inputPath = ARG;
const contents = (await read_file(inputPath)).toString();

// Split file into frontmatter (where the props are) and the body
const [, rawFrontmatter, ...bodyParts] = contents.split("---\n");
if (rawFrontmatter === undefined) {
  throw new Error(`${inputPath} is missing frontmatter`);
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

/** @type {Record<string, any>} */
const frontmatter = {};
let arrayKey = undefined;
// Read the frontmatter into a Javascript object
for (const line of rawFrontmatter.split("\n")) {
  if (arrayKey) {
    if (line.startsWith("  -")) {
      /** @type {Array<string>} */
      const arr = frontmatter[arrayKey] ?? [];
      arr.push(parseValue(line.slice(3)));
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

const fullBody = bodyParts.join("---\n");
const [beforeFold_, ...afterFoldParts] = fullBody.split("===\n");
const beforeFold = beforeFold_ ?? "";
const body = beforeFold + afterFoldParts.join("===\n");

/** @type {import("./types").PartialPage} */
export default {
  inputPath,
  frontmatter,
  beforeFold: store(beforeFold),
  body: store(body),
};
