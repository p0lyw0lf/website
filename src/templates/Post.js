import { run_js } from "driver";
import { RandomHeaderPfp } from "../components/RandomHeaderPfp.js";
import { SITE_URL } from "../data/urls.js";
import { html } from "../render.js";
import { Base } from "./Base.js";

/**
 * @typedef {import("./Base.js").Props} BaseProps
 *
 * @typedef {BaseProps} Props
 * @property {string} sectionTitle
 * @property {string} homeLink
 * @property {string} [rssLink]
 * @property {boolean} [isDraft]
 *
 * @typedef {object} Slots
 * @property {string} [extraHead]
 * @property {string} [footer]
 *
 * @callback Render
 * @param {string} mainSlot
 * @param {Slots} [extraSlots]
 * @returns {Promise<import("driver").StoreObject>}
 */

/**
 * @param {BaseProps & Props} props
 * @returns {Render}
 */
export const Post =
  ({ sectionTitle, homeLink, rssLink, isDraft, ...props }) =>
  async (slot, extraSlots = {}) => {
    const { extraHead, footer } = extraSlots;
    return Base(props)(slot, {
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
      `.withStyle((await run_js("src/css/post.css.js", null)).toString()),
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
        : html`
            <header>
              ${await RandomHeaderPfp()}
              <div>
                <h2><a href="${homeLink}">${sectionTitle}</a></h2>
                <nav>
                  <a href="/">Home</a>
                  <a href="/about/">About</a>
                  <a href="/friends/">Friends</a>
                  <a href="/art/">Art</a>
                  <a href="/blog/">Blog</a>
                  <a href="/cybersec/">Cybersec</a>
                </nav>
              </div>
            </header>
          `,
      footer,
    });
  };
