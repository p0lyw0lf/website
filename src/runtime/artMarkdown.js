import { markdown_to_html, minify_html, store } from "driver";
import { html } from "../render.js";
import { replaceMatches } from "../util.js";

const LINK_REGEX =
  /<(?<tag>\w+)\s+(handle|username)="(?<handle>[\w\.]+)"\s+\/>/gm;

/**
 * Given a store argument in ARG, format the markdown as HTML, applying any special transformations
 * that we need to have happen.
 *
 * Specifically, transform all link elements to be the appropriate link types.
 */

const tagTransforms = {
  BskyLink: (handle) =>
    html`<a href="https://bsky.app/profile/${handle}">@${handle}</a>`,
  InstagramLink: (username) =>
    html`<a href="https://instagram.com/${username}">@${username}</a>`,
  TwitterLink: (username) =>
    html`<a href="https://twitter.com/${username}">@${username}</a>`,
};

const contents = await replaceMatches(
  LINK_REGEX,
  ARG.toString(),
  async (match) => {
    const tag = match.groups.tag || "";
    const handle = match.groups.handle || "";
    const transform = tagTransforms[tag];
    if (!handle || !transform) return match[0];
    return transform(handle);
  },
);

export default await minify_html(await markdown_to_html(store(contents)));
