import { run_task } from "memoized";
import { RandomHeaderPfp } from "../components/RandomHeaderPfp.js";
import { SITE_URL } from "../data/urls.js";
import { html } from "../render.js";
import { Base } from "./Base.js";

/**
 * @typedef {import("./Base.js").Props} BaseProps
 *
 * @typedef {object} Props
 * @property {string} sectionTitle
 * @property {string} homeLink
 * @property {string} [rssLink]
 *
 * @typedef {object} Slots
 * @property {string} [extraHead]
 * @property {string} [footer]
 *
 * @callback Render
 * @param {string} mainSlot
 * @param {Slots} [extraSlots]
 * @returns {import("io").StoreObject}
 */

/**
 * @param {BaseProps & Props} props
 * @returns {Render}
 */
export const Post =
  ({ sectionTitle, homeLink, rssLink, ...props }) =>
  (slot, extraSlots = {}) => {
    const { extraHead, footer } = extraSlots;
    return Base(props)(slot, {
      extraHead: html`
        <link
          rel="alternate"
          type="application/rss+xml"
          title="${sectionTitle}"
          href="${`${SITE_URL}/${rssLink ?? `${homeLink}rss.xml`}`}"
        />
        ${extraHead}
      `.withStyle(run_task("../css/post.css.js", null).toString()),
      header: html`
        <header>
          ${RandomHeaderPfp()}
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
