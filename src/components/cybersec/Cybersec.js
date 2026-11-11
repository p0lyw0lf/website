import { html } from "../../../lib/html.js";
import { toCybersecUrl } from "../../urls.js";
import { Post } from "../blog/Post.js";

/**
 * @typedef {object} Props
 * @property {string} slug
 * @property {string} title
 * @property {string} repost_link
 * @property {string} date
 *
 * @typedef {object} Slots
 * @property {import("../../../lib/html_types").HTML=} [extraHead]
 *
 * @callback Render
 * @param {import("../../../lib/html_types").HTML} slot
 * @param {Slots=} [extraSlots]
 * @returns {Promise<import("driver").StoreObject>}
 */

/**
 * @param {Props} props
 * @returns {Render}
 */
export const Cybersec =
  ({ slug, title, repost_link, date }) =>
  async (slot, extraSlots = {}) => {
    const url = toCybersecUrl(slug);
    return await Post({
      pathname: url,
      sectionTitle: "PolyWolf on Security",
      homeLink: "/cybersec/",
      title,
    })(
      html`
        <h1>${title}</h1>
        <p
          >Posted on ${date}: <a href="${repost_link}">${repost_link}</a>
          ${slot}
        </p>
      `,
      extraSlots,
    );
  };
