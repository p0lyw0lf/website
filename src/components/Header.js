import { html } from "../render.js";
import { RandomHeaderPfp } from "./RandomHeaderPfp.js";

/**
 * @typedef {object} Props
 * @property {string} sectionTitle
 * @property {string} homeLink
 */

/**
 * @param {Props} props
 * @returns {Promise<import("driver").StoreObject>}
 */
export const Header = async ({ sectionTitle, homeLink }) => html`
  <header>
    ${await RandomHeaderPfp()}
    <div>
      <h2><a href="${homeLink}">${sectionTitle}</a></h2>
      <nav>
        <a href="/">Home</a>
        <a href="/art/">Art</a>
        <a href="/blog/">Blog</a>
        <a href="/cybersec/">Cybersec</a>
        <a href="/about/">About</a>
        <a href="/friends/">Friends</a>
        <a href="/blogroll/">Blogroll</a>
      </nav>
    </div>
  </header>
`;
