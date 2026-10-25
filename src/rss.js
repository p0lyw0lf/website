import { SITE_URL } from "../CONFIG.js";
import { html } from "../lib/html.js";
import { markdownToHtml, minifyHtml } from "../lib/runtime/index.js";
import { toBlogUrl, toCybersecUrl } from "./urls.js";

/**
 * @param {string} body
 * @returns {string}
 */
export const escapeBody = (body) => {
  const escaped = body.replace("]]>", "]]&gt;");
  return `<![CDATA[${escaped}]]>`;
};

/**
 * @param {import("./content/types").BlogPage} props
 * @returns {Promise<import("../lib/html_types").HTML>}
 */
export const toBlogFeedEntry = async ({ frontmatter, body, slug }) => {
  if (!slug) throw new Error("feed must come from collection");
  const { title, description, published } = frontmatter;
  const formattedPublished = Temporal.Instant.fromEpochMilliseconds(
    published * 1000,
  ).toString();
  const url = SITE_URL + toBlogUrl(slug);

  // TODO: If we ever decide to add markdown passes that _aren't_ transforming images, we'll need to
  // add some parameters to our src/runtime/markdown.js task.
  const content = await minifyHtml(await markdownToHtml(body));

  return html`
    <entry>
      <title>${escapeBody(title)}</title>
      <link rel="alternate" href="${url}" />
      <id>${url}</id>
      <published>${formattedPublished}</published>
      <updated>${formattedPublished}</updated>
      ${description && html`<summary>${escapeBody(description)}</summary>`}
      <content type="html">${escapeBody(content.toString())}</content>
      <author>
        <name>PolyWolf</name>
        <uri>https://wolf.girl.technology/</uri>
      </author>
    </entry>
  `;
};

/**
 * @param {import("./content/types").CybersecPage} props
 * @returns {Promise<import("../lib/html_types").HTML>}
 */
export const toCybersecFeedEntry = async ({ frontmatter, body, slug }) => {
  if (!slug) throw new Error("feed must come from collection");
  const { title, repost_link } = frontmatter;
  const date = Temporal.PlainDate.from(slug.slice(0, 10));
  const formattedPublished = date.toPlainDateTime("12:00:00").toString() + "Z";
  const url = SITE_URL + toCybersecUrl(slug);
  const content = await minifyHtml(await markdownToHtml(body));

  return html`
    <entry>
      <title>${escapeBody(title)}</title>
      <link rel="alternate" href="${url}" />
      <id>${url}</id>
      <published>${formattedPublished}</published>
      <updated>${formattedPublished}</updated>
      <content type="html"
        >${escapeBody(
          `<a href="${repost_link}">${repost_link}</a><br />` +
            content.toString(),
        )}</content
      >
      <author>
        <name>PolyWolf</name>
        <uri>https://wolf.girl.technology/</uri>
      </author>
    </entry>
  `;
};
