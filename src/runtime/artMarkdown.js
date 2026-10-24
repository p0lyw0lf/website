import { store } from "driver";
import { html } from "../../lib/html.js";
import { replaceMatches } from "../../lib/regex.js";
import { plainMarkdownToHtml } from "../../lib/runtime/index.js";

const LINK_REGEX =
  /<(?<tag>\w+)\s+(handle|username)="(?<handle>[\w\.]+)"\s+\/>/gm;

/**
 * Given a store argument in ARG, format the markdown as HTML, applying any special transformations
 * that we need to have happen.
 *
 * Specifically, transform all link elements to be the appropriate link types.
 */

/** @type {Record<string, (username: string) => import("../../lib/html.js").HTML>} */
const tagTransforms = {
  BskyLink: (username) =>
    html`<a href="https://bsky.app/profile/${username}">@${username}</a>`,
  InstagramLink: (username) =>
    html`<a href="https://instagram.com/${username}">@${username}</a>`,
  TwitterLink: (username) =>
    html`<a href="https://twitter.com/${username}">@${username}</a>`,
};

const body = await replaceMatches(LINK_REGEX, ARG.toString(), async (match) => {
  const tag = match.groups?.["tag"] || "";
  const handle = match.groups?.["handle"] || "";
  const transform = tagTransforms[tag];
  if (!handle || !transform) return match[0];
  return transform(handle);
});

export default await plainMarkdownToHtml(store(body));
