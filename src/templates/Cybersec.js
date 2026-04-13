import { toCybersecUrl } from "../data/urls.js";
import { html } from "../render.js";
import { Post } from "./Post.js";

/**
 * @typedef {object} Props
 * @property {string} slug
 * @property {string} title
 * @property {string} repost_link
 * @property {string} date
 *
 * @callback Render
 * @param {string} slot
 * @returns {Promise<import("driver").StoreObject>}
 */

/**
 * @param {Props} props
 * @returns {Render}
 */
export const Cybersec =
  ({ slug, title, repost_link, date }) =>
  async (slot) => {
    const url = toCybersecUrl(slug);
    return await Post({
      pathname: url,
      sectionTitle: "PolyWolf on Security",
      homeLink: "/cybersec/",
      title,
    })(html`
      <h1> ${title} </h1>
      <p
        >Posted on ${date}: <a href="${repost_link}">${repost_link}</a>
        ${slot}
      </p>
    `);
  };
