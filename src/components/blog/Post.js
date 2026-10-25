import { SITE_URL } from "../../../CONFIG.js";
import { html } from "../../../lib/html.js";
import PostCss from "../../css/Post.css.js";
import { Base } from "../Base.js";
import { Header } from "../Header.js";

/**
 * @typedef {import("../Base.js").Props} BaseProps
 * @typedef {import("../../../lib/html_types").HTML} HTML
 *
 * @typedef {object} Props
 * @property {string} sectionTitle
 * @property {string} homeLink
 * @property {string} [rssLink]
 * @property {boolean} [isDraft]
 *
 * @typedef {object} Slots
 * @property {HTML=} [extraHead]
 * @property {HTML=} [footer]
 *
 * @callback Render
 * @param {HTML} mainSlot
 * @param {Slots=} [extraSlots]
 * @returns {Promise<import("driver").StoreObject>}
 */

/**
 * @param {BaseProps & Props} props
 * @returns {Render}
 */
export const Post =
  ({ sectionTitle, homeLink, rssLink, isDraft, ...props }) =>
  async (mainSlot, extraSlots = {}) => {
    const { extraHead, footer } = extraSlots;
    return Base(props)(mainSlot, {
      extraHead: html`
        <link
          rel="alternate"
          type="application/atom+xml"
          title="${sectionTitle}"
          href="${SITE_URL + (rssLink ?? `${homeLink}rss.xml`)}"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.46/dist/katex.min.css"
          integrity="sha384-hW6ZmmePRD2f/9cuxGE6C9faGprtIBOme5OLUiEjtRKMTN67tY23ur9eAi21H8De"
          crossorigin="anonymous"
        />
        ${extraHead}
      `.withStyle(PostCss),
      header: isDraft
        ? html`
            <header>
              <div>
                <h2><a href="/drafts/">${sectionTitle}</a></h2>
                <nav>
                  <a href="?preview=1">Preview</a>
                </nav>
              </div>
            </header>
          `
        : await Header({ sectionTitle, homeLink }),
      footer,
    });
  };
