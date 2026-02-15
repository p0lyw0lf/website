export const SITE_URL = "https://wolfgirl.dev";
export const STATIC_URL = "https://static.wolfgirl.dev";

/**
 * @param {string} src
 * @returns {string}
 */
export const toArtUrl = (src) => `${STATIC_URL}/art/${src}`;

/**
 * @param {string} slug
 * @returns {string}
 */
export const toBlogUrl = (slug) => `/blog/${slug}/`;

/**
 * @param {string} tag
 * @returns {string}
 */
export const toTagUrl = (tag) => `/tags/${tag}/`;

/**
 * @param {string} slug
 * @returns {string}
 */
export const toCybersecUrl = (slug) => `/cybersec/${slug}/`;

const atprotoPostRegex = /at:\/\/(.*)\/app\.bsky\.feed\.post\/(.*)/;
/**
 * @param {string} atprotoUrl
 * @returns {string=}
 */
export const atprotoPostUrl = (atprotoUrl) => {
  const matches = atprotoUrl.match(atprotoPostRegex);
  const did = matches?.[1];
  const postId = matches?.[2];
  if (did && postId) {
    return `https://bsky.app/profile/${did}/post/${postId}`;
  }
  return undefined;
};
