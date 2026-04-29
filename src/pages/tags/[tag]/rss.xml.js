import { run_task, store } from "driver";
import { toBlogFeedEntry } from "../../../data/rss.js";
import { SITE_URL, toTagUrl } from "../../../data/urls.js";
import { html } from "../../../render.js";

const getTags = async () => {
  return await run_task("src/pages/tags/[tag].html.js", null);
};

export const buildTagFeed = async ({ tag, pages }) => {
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

export default ARG ? await buildTagFeed(ARG) : await getTags();
