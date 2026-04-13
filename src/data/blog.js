import { run_task } from "driver";
import { html } from "../render.js";
import { toBlogUrl } from "./urls.js";

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
export const toFeedItem = async ({ frontmatter, body, slug }) => {
  const { title, description, published } = frontmatter;
  const formattedPublished = Temporal.Instant.fromEpochMilliseconds(
    published * 1000,
  ).toString();
  const url = toBlogUrl(slug);
  const content = await run_task("src/runtime/markdown.js", body);

  return html`
    <entry>
      <title>${escapeXml(title)}</title>
      <link rel="alternate" href="${url}" />
      <id>${slug}</id>
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
