import { run_task, store } from "driver";
import { toFeedItem } from "../../data/blog.js";
import { SITE_URL } from "../../data/urls.js";
import { html } from "../../render.js";

const site = SITE_URL + "/blog/";

const pages = await run_task("src/pages/blog/[slug].html.js", null);
const lastUpdated = pages[0]
  ? Temporal.Instant.fromEpochMilliseconds(
      pages[0].frontmatter.published * 1000,
    )
  : Temporal.Now.instant();
const entries = await Promise.all(pages.map(async (page) => toFeedItem(page)));

const feed = html`
  <feed xmlns="http://www.w3.org/2005/Atom">
    <id>${site}</id>
    <title>PolyWolf's Blog</title>
    <subtitle>a blog written by PolyWolf</subtitle>
    <icon>/apple-touch-icon.png</icon>
    <link href="${site + "rss.xml"}" rel="self" />
    <link href="${site}" />
    <updated>${lastUpdated.toString()}</updated>
    ${entries}
  </feed>
`;

export default store(
  `<?xml version="1.0" encoding="utf-8"?>` + feed.toString(),
);

export async function GET() {
  const container = await AstroContainer.create();

  const entries = await getBlogEntries();
  const items = await Promise.all(entries.map(toFeedItem(container)));

  return rss({
    title: "PolyWolf's Blog",
    description: "a blog written by PolyWolf",
    site: new URL("/blog/", SITE_URL).toString(),
    items,
    customData: `<language>en-us</language>`,
  });
}
