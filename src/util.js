/**
 * @callback Replacer
 * @param {RegExpMatchArray} match
 * @returns {Promise<string>}
 */

/**
 * Given a regex, a string to match it against, and a function that turns a match into some new text,
 * replaces all the matches by applying the function.
 *
 * The regex MUST have the `g` flag, and you MUST have unique ownership of the regex (clone it if you don't).
 *
 * @param {RegExp} regex
 * @param {string} s
 * @param {Replacer} f
 * @returns {Promise<string>}
 */
export const replaceMatches = async (r, s, f) => {
  /** @type {Array<string>} - Contains all non-matched parts of s */
  const nonMatches = [];
  /** @type {Array<RegExpMatchArray`>} - Contains all the matched parts of s */
  const matches = [];
  /** @type {RegExpMatchArray} - The latest match of s */
  let currentMatch;
  /** Where the previous match had ended */
  let lastIndex = 0;
  while ((currentMatch = r.exec(s)) !== null) {
    nonMatches.push(s.slice(lastIndex, currentMatch.index));
    matches.push(currentMatch);
    lastIndex = r.lastIndex;
  }

  const replacements = await Promise.all(
    matches.map(async (match) => {
      return await f(match);
    }),
  );

  /** @type{Array<string>} - Contains the non-matched parts of s and the transformed matched parts */
  const chunks = [];
  for (let i = 0; i < matches.length; i++) {
    chunks.push(nonMatches[i]);
    chunks.push(replacements[i]);
  }
  chunks.push(s.slice(lastIndex));

  return chunks.join("");
};
