import { run_task } from "driver";
import { html } from "../render.js";
import { SITE_URL, toBlogUrl, toCybersecUrl } from "./urls.js";

export const escapeXml = (unsafe) =>
  unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });

export const escapeBody = (body) => {
  const escaped = body.replace("]]>", "]]&gt;");
  return `<![CDATA[${escaped}]]>`;
};

/**
 * @param {import("./collections.js").File} file
 * @returns {Promise<string>}
 */
export const toBlogFeedEntry = async ({ frontmatter, body, slug }) => {
  const { title, description, published } = frontmatter;
  const formattedPublished = Temporal.Instant.fromEpochMilliseconds(
    published * 1000,
  ).toString();
  const url = SITE_URL + toBlogUrl(slug);
  const content = await run_task("src/runtime/markdown.js", body);

  return html`
    <entry>
      <title>${escapeXml(title)}</title>
      <link rel="alternate" href="${url}" />
      <id>${url}</id>
      <published>${formattedPublished}</published>
      <updated>${formattedPublished}</updated>
      ${description && html`<summary>${escapeXml(description)}</summary>`}
      <content type="html">${escapeBody(content.toString())}</content>
      <author>
        <name>PolyWolf</name>
        <uri>https://wolf.girl.technology/</uri>
      </author>
    </entry>
  `;
};

/**
 * @param {import("./collections.js").File} file
 * @returns {Promise<string>}
 */
export const toCybersecFeedEntry = async ({ frontmatter, body, slug }) => {
  const { title, repost_link } = frontmatter;
  const date = Temporal.PlainDate.from(slug.slice(0, 10));
  const formattedPublished = date.toPlainDateTime("12:00:00").toString() + "Z";
  const url = SITE_URL + toCybersecUrl(slug);
  const content = await run_task("src/runtime/markdown.js", body);

  return html`
    <entry>
      <title>${escapeXml(title)}</title>
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
