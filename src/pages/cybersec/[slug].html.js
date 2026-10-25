import { html } from "../../../lib/html.js";
import { markdownToHtml } from "../../../lib/runtime/index.js";
import { Cybersec } from "../../components/cybersec/Cybersec.js";
import { cybersec } from "../../content/config.js";

/**
 * @typedef {import("../../content/types").CybersecPage} Props
 */

/** @returns {Promise<Props[]>} */
const list = async () => {
  const pages = await cybersec.all();
  // Sorting by slug is like sorting by date, effectively
  return pages.sort((a, b) => b.slug.localeCompare(a.slug));
};

/**
 * @param {Props} page
 * @returns {Promise<import("driver").StoreObject>}
 */
const build = async ({ frontmatter, body, slug }) => {
  const { title, repost_link } = frontmatter;
  return await Cybersec({ slug, title, repost_link, date: slug.slice(0, 10) })(
    html`<article class="e-content">${await markdownToHtml(body)}</article>`,
  );
};

/** @type {Props | null} */
const page = ARG;
export default page ? await build(page) : await list();
