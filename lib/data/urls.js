import { EXTERNAL_REPLACEMENTS } from "../../CONFIG.js";

/**
 * Given an output path, checks it against `EXTERNAL_REPLACEMENTS`, and returns a string only if one matches.
 *
 * @param {string} url
 * @returns {string | undefined}
 */
export const externalReplacementUrl = (url) => {
  for (const [regex, replacement] of EXTERNAL_REPLACEMENTS) {
    let match;
    if (typeof replacement === "string" && (match = regex.exec(url)) !== null) {
      if (match[1] === undefined) {
        throw new Error(
          "external replacement must have match group to replace",
        );
      }
      return replacement.replace("%s", match[1]);
    }
  }
  return undefined;
};
