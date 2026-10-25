import { run_js, store } from "driver";
import { SITE_URL } from "../../../CONFIG.js";
import { html } from "../../../lib/html.js";
import { toCybersecFeedEntry } from "../../rss.js";

const site = SITE_URL + "/cybersec/";

const pages = await run_js("src/pages/cybersec/[slug].html.js", null);
const lastUpdated = pages[0]
  ? Temporal.PlainDate.from(pages[0].slug.slice(0, 10))
      .toPlainDateTime("12:00:00")
      .toString() + "Z"
  : Temporal.Now.instant().toString();
const entries = await Promise.all(
  pages.map(async (page) => toCybersecFeedEntry(page)),
);

const feed = html`
  <feed xmlns="http://www.w3.org/2005/Atom">
    <id>${site}</id>
    <title>PolyWolf On Security</title>
    <subtitle
      >reposts of various cybersecurity-themed news that i find
      interesting</subtitle
    >
    <icon>/apple-touch-icon.png</icon>
    <link href="${site + "rss.xml"}" rel="self" />
    <link href="${site}" />
    <updated>${lastUpdated}</updated>
    ${entries}
  </feed>
`;

export default store(
  `<?xml version="1.0" encoding="utf-8"?>` + feed.toString(),
);
