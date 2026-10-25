import { store } from "driver";
import { SITE_URL } from "../../../../CONFIG.js";
import { html } from "../../../../lib/html.js";
import { listBlogPagesByTag } from "../../../content/config.js";
import { toBlogFeedEntry } from "../../../rss.js";
import { toTagUrl } from "../../../urls.js";

/**
 * @typedef {import("../[tag].html.js").Props} Props
 */

/**
 * @param {Props} props
 * @returns {Promise<import("driver").StoreObject>}
 */
const build = async ({ tag, pages }) => {
  const site = SITE_URL + "/blog/";

  const lastUpdated = pages[0]
    ? Temporal.Instant.fromEpochMilliseconds(
        pages[0].frontmatter.published * 1000,
      )
    : Temporal.Now.instant();
  const entries = await Promise.all(
    pages.map(async (page) => toBlogFeedEntry(page)),
  );

  const feed = html`
    <feed xmlns="http://www.w3.org/2005/Atom">
      <id>${site}</id>
      <title>PolyWolf's Blog - #${tag}</title>
      <subtitle
        >all posts tagged "${tag}" on a blog written by PolyWolf</subtitle
      >
      <icon>/apple-touch-icon.png</icon>
      <link href="${toTagUrl(tag) + "rss.xml"}" rel="self" />
      <link href="${site}" />
      <updated>${lastUpdated}</updated>
      ${entries}
    </feed>
  `;

  return store(`<?xml version="1.0" encoding="utf-8"?>` + feed.toString());
};

/** @type {Props | null} */
const page = ARG;
export default page ? await build(page) : await listBlogPagesByTag();
