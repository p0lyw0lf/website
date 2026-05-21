import { slugify } from "driver";

/**
 * @param {string} path
 * @returns {string} directory part of the path
 */
export const dirname = (path) => {
  const parts = path.split("/");
  return parts.slice(0, -1).join("/");
};

/**
 * @param {string} path
 * @returns {string} filename
 */
export const basename = (dir) => {
  const parts = dir.split("/");
  return parts[parts.length - 1];
};

/**
 * @param {string} path
 * @returns {[string, string]} everything before the first dot in the basename, and everything after that dot
 */
export const splitext = (path) => {
  const parts = path.split("/");
  const dir = parts.slice(0, -1);
  const filename = parts[parts.length - 1];
  const dotIndex = filename.indexOf(".");
  if (dotIndex <= 0) {
    return [path, ""];
  }
  dir.push(`${filename.slice(0, dotIndex)}`);
  return [dir.join("/"), filename.slice(dotIndex + 1)];
};

/**
 * @param {string} path
 * @returns {string} Returns the path with all directories and the filename (minus extension) passed through the `slugify()` transformation.
 */
export const slugifyPath = (path, transform = slugify) => {
  const parts = path.split("/");
  const dir = parts.slice(0, -1).map(transform);
  const [base, ext] = splitext(parts[parts.length - 1]);
  dir.push(`${transform(base)}${ext ? "." : ""}${ext}`);
  return dir.join("/");
};
